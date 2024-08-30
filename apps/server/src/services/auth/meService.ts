import { eq } from "drizzle-orm";

import { db } from "@/db";
import ApiError from "../../utils/ApiError";
import { User, userWorkspaceTable, Workspace } from "../../models";
import { GetMeServiceResult } from "../../../../types/services";

import "express-async-errors";
import toIUser from "../../models/user/methods/toTUser";
import toIWorkspace from "../../models/workspace/methods/toTWorkspace";
import toIUserWorkspaceData from "../../models/user-workspace/methods/toTUserWorkspaceData";
import { WorkspaceMapper } from "@/domains/workspace";

export default async (
	currentUser: User,
	resolveWorkspaceId?: number,
): Promise<GetMeServiceResult> => {
	// Get workspaces of the user
	const userWorkspaces = await db.query.userWorkspaceTable.findMany({
		where: eq(userWorkspaceTable.userId, currentUser.id),
		with: {
			workspace: true,
		},
	});
	const workspaces = userWorkspaces.map(
		userWorkspace => userWorkspace.workspace,
	);

	let currentWorkspace: Workspace | undefined = undefined;
	if (resolveWorkspaceId !== undefined) {
		// Find workspace
		currentWorkspace =
			workspaces.find(workspace => workspace.id === resolveWorkspaceId) ??
			workspaces[0];
	} else {
		currentWorkspace = workspaces[0];
	}

	if (!currentWorkspace && workspaces.length === 0) {
		throw new ApiError("UserHasNoWorkspaces", 404);
	}

	// todo handle no workspace case

	// Find userWorkspace data
	const userWorkspaceData = userWorkspaces.find(
		userWorkspace => userWorkspace.workspaceId === currentWorkspace!.id,
	)!;

	return {
		user: toIUser(currentUser),
		workspaces: workspaces.map(WorkspaceMapper.toModel),
		currentWorkspace: currentWorkspace && toIWorkspace(currentWorkspace!),
		userWorkspaceData: toIUserWorkspaceData(userWorkspaceData),
	};
};
