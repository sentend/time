import { eq } from "drizzle-orm";
import { db } from "@/db";
import { sessionTable } from "@/domains/session";
import { HTTPError } from "@/libs/httpError";
import { createMiddleware } from "hono/factory";

export const resolveUser = createMiddleware(async (ctx, next) => {
	ctx.__internalState = {} as any;
	const { req } = ctx;
	const bearerToken = req.header("Authorization");

	if (!bearerToken || !bearerToken.startsWith("Bearer ")) {
		throw new HTTPError(401, { message: "Unauthorized: no token" });
	}

	const sessionId = bearerToken.substring(7);

	const currentSession = await db.query.sessionTable.findFirst({
		where: eq(sessionTable.id, sessionId),
		with: {
			user: true,
		},
	});

	if (!currentSession) {
		throw new HTTPError(401, { message: "Unauthorized: no session" });
	}

	const currentTime = new Date();
	const sessionExpiredTime = new Date(currentSession.expTime);
	if (currentTime > sessionExpiredTime) {
		// вынести в репозиторий
		await db
			.delete(sessionTable)
			.where(eq(sessionTable.id, currentSession.id));

		throw new HTTPError(401, {
			message: "Unauthorized: Session expired",
		});
	}

	const user = currentSession.user;
	if (!user) {
		throw new HTTPError(401, { message: "Unauthorized: No user" });
	}

	ctx.__internalState.currentUser = user;

	await next();
});
