import crypto from "crypto";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import ApiError from "../../utils/ApiError";
import { SignupServiceInput, SignupServiceResult } from "../../../../types/services";
import { sessionTable, userTable, userWorkspaceTable, workspaceTable } from "../../models";

import "express-async-errors";

const SALT = process.env.SALT || "";

export default async ({
    name,
    email,
    password,
    workspaceName,
}: SignupServiceInput): Promise<SignupServiceResult> => {
    // TODO: validate input data (with zod?)
    if (!email || !password || !name) {
        throw new Error("Invalid input data");
    }

    // Check if user with this email already exists
    const existingUser = await db.query.userTable.findFirst({
        where: eq(userTable.email, email),
    });
    if (existingUser) {
        throw new ApiError("EmailAlreadyUsed", 400);
    }

    const effectiveWorkspaceName = workspaceName || name + "'s workspace";

    const initials = name
        .split(" ")
        .slice(0, 2)
        .map(item => item.charAt(0))
        .join("");

    // Hash password
    let passwordHash: string = "";
    try {
        passwordHash = crypto.pbkdf2Sync(password, SALT, 310000, 32, "sha256").toString("base64");
    } catch (err) {
        throw new ApiError("InvalidPassword", 400);
    }

    // TODO: add transaction

    // Create new user and workspace
    const [newUser, newWorkspace] = await Promise.all([
        db.insert(userTable).values({ email, name, initials, passwordHash }).returning(),
        db.insert(workspaceTable).values({ name: effectiveWorkspaceName }).returning(),
    ]);

    if (newUser.length <= 0) {
        throw new ApiError("CouldNotCreateNewUser");
    }

    if (newWorkspace.length <= 0) {
        throw new ApiError("CouldNotCreateNewWorkspace");
    }

    await db
        .insert(userWorkspaceTable)
        .values({
            userId: newUser[0].id,
            workspaceId: newWorkspace[0].id,
            isAdmin: true,
            isOwner: true,
            canCreateProjects: true,
            isActive: true,
        })
        .returning();

    // Create new session
    const newSession = (
        await db.insert(sessionTable).values({ userId: newUser[0].id }).returning()
    )[0];

    return { sessionId: newSession.id };
};
