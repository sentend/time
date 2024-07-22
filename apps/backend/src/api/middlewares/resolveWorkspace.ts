import { NextFunction, Request, Response } from "express";

import { db } from "@/db";
import ApiError from "../../utils/ApiError";
import NotAuthorizedError from "../../utils/NotAuthorizedError";

export const resolveWorkspace = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	if (!req.params.workspaceId) {
		return next();
	}

	const workspaceId = parseInt(req.params.workspaceId);
	if (!workspaceId) {
		throw new ApiError("InvalidWorkspaceId", 400);
	}

	const workspace = await db.query.workspaceTable.findFirst({
		where(t, { eq }) {
			return eq(t.id, workspaceId);
		},
	});

	if (!workspace) {
		throw new ApiError("NoSuchWorkspace", 404);
	}

	const user = req.user!;

	const userWorkspace = await db.query.userWorkspaceTable.findFirst({
		where(fields, { and, eq }) {
			return and(eq(fields.workspaceId, workspaceId), eq(fields.userId, user.id));
		},
	});

	if (!userWorkspace?.isActive) {
		throw new NotAuthorizedError();
	}

	req.workspace = workspace;

	next();
};
