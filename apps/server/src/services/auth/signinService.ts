import { eq } from "drizzle-orm";
import crypto, { BinaryLike } from "crypto";

import { db } from "@/db";
import ApiError from "../../utils/ApiError";
import { sessionTable, userTable } from "../../models";
import { SigninServiceInput, SigninServiceResult } from "../../../../types/services";

import "express-async-errors";

const SALT = process.env.SALT as BinaryLike;

export default async ({ email, password }: SigninServiceInput): Promise<SigninServiceResult> => {
    if (!email || !password) {
        throw new ApiError("EmailOrPasswordIsNotCorrect", 400);
    }

    // Get user
    const currentUser = await db.query.userTable.findFirst({
        where: eq(userTable.email, email),
    });

    if (!currentUser) {
        throw new ApiError("EmailOrPasswordIsNotCorrect", 400);
    }

    // Compare password
    const passwordHash = Buffer.from(currentUser.passwordHash, "base64");
    let inputPasswordHash: Buffer | undefined = undefined;
    try {
        inputPasswordHash = crypto.pbkdf2Sync(password, SALT, 310000, 32, "sha256");
    } catch (err) {
        throw new ApiError("EmailOrPasswordIsNotCorrect", 400);
    }
    if (!crypto.timingSafeEqual(inputPasswordHash, passwordHash)) {
        throw new ApiError("EmailOrPasswordIsNotCorrect", 400);
    }

    // Create new session
    const newSession = (
        await db.insert(sessionTable).values({ userId: currentUser.id }).returning()
    )[0];

    return { sessionId: newSession.id };
};
