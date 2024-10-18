import pick from "lodash/pick";

import { db } from "@/db";
import { Paging } from "../../utils/Paging";
import { Sorting } from "../../utils/Sorting";
import { User, Workspace } from "../../models";
import { GetProjectsService } from "../../../../types/services";

export type GetProjectsFilter = {
	isArchived?: boolean;
	searchText?: string;
};

export default async (
	workspace: Workspace,
	filter: GetProjectsFilter,
	sorting: Sorting,
	paging: Paging | undefined,
	currentUser: User,
): Promise<GetProjectsService.ProjectItem[]> => {
	// TODO: Check permissions first

	// TODO - add search text
	const projects = await db.query.projectTable.findMany({
		where(t, { eq, and }) {
			return and(eq(t.workspaceId, workspace.id), eq(t.isArchived, !!filter.isArchived));
		},
		orderBy: sorting.toOrderBy(),
		offset: paging?.offset,
		limit: paging?.limit,
		columns: {
			id: true,
			name: true,
			colorId: true,
			createdAt: true,
			updatedAt: true,
			avatarFilename: true,
			isArchived: true,
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

	// Project properties
	const results: GetProjectsService.ProjectItem[] = projects.map(project => {
		return {
			...pick(project, ["colorId", "isArchived", "id", "name", "updatedAt", "createdAt"]),
			members: project.members.map(member => {
				return pick(member.user, ["id", "name", "initials"]);
			}),
			clientName: project.client?.name ?? null,
		};
	});

	return results;
};
