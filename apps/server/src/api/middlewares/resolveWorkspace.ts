import { workspaceMemberRepository } from "@/domains/workspace-member";
import { workspaceRepository } from "@/domains/workspace";
import { HTTPError } from "@/libs/httpError";
import { createMiddleware } from "hono/factory";

export const resolveWorkspace = createMiddleware(async (ctx, next) => {
	const workspaceId = Number(ctx.req.param("workspaceId"));

	if (!workspaceId) {
		throw new HTTPError(400, { message: "InvalidWorkspaceId" });
	}

	const workspace = await workspaceRepository.findById(workspaceId);

	if (!workspace) {
		throw new HTTPError(404, { message: "NoSuchWorkspace" });
	}

	const userWorkspace =
		await workspaceMemberRepository.getByUserIdAndWorkspaceId(
			ctx.__internalState.currentUser.id,
			workspace.id,
		);

	if (!userWorkspace) {
		throw new HTTPError(404, { message: "NoSuchWorkspace" });
	}

	if (!userWorkspace.isActive) {
		throw new HTTPError(403, { message: "YouAreNotActiveInThisWorkspace" });
	}

	ctx.__internalState.currentWorkspace = workspace;

	await next();
});
