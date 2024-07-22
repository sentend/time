import { NextFunction, Request, Response } from "express";
import { sessionTable } from "../../models";
import { eq } from "drizzle-orm";
import ApiError from "../../utils/ApiError";
import { db } from "@/db";

export const resolveUser = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	const bearerToken = req.header("Authorization");

	if (bearerToken && bearerToken.startsWith("Bearer ")) {
		const sessionId = bearerToken.substring(7);
		const currentSession = await db.query.sessionTable.findFirst({
			where: eq(sessionTable.id, sessionId),
			with: {
				user: true,
			},
		});

		if (!currentSession) {
			throw new ApiError("NoSuchSession", 404);
		}

		const currentTime = new Date();
		const sessionExpiredTime = new Date(currentSession.expTime);
		if (currentTime > sessionExpiredTime) {
			await db.delete(sessionTable).where(eq(sessionTable.id, currentSession.id));
			throw new ApiError("SessionIsExprired", 409);
		}

		const user = currentSession.user;
		if (!user) {
			throw new ApiError("NoSuchUser", 404);
		}
		req.user = user;
	}

	next();
};
