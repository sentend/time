import { User, Workspace } from "@/models";
import { TProject } from "~types/models";

import ApiError from "../../utils/ApiError";
import { db } from "@/db";
import {} from "@/models/project/methods";
import { toTProject } from "@/models/project/methods";

export type GetProjectsFilter = {
	isArchived?: boolean;
	searchText?: string;
};

export default async (
	workspace: Workspace,
	projectId: string,
	currentUser: User,
): Promise<TProject> => {
	// TODO: Check permissions first

	const project = await db.query.projectTable.findFirst({
		where(table, { eq }) {
			return eq(table.id, projectId);
		},
		with: {
			members: {
				with: {
					user: true,
				},
			},
			client: true,
		},
	});

	if (!project) {
		throw new ApiError("NoSuchProject", 404);
	}

	// Project properties

	return toTProject(project);
};
