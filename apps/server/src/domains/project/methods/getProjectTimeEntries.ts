import { db } from "@/db";
import { Project, User, Workspace, nodeTable } from "@/models";
import { toTTimeEntry } from "@/models/timeEntry/methods";
import { eq, sql } from "drizzle-orm";

export type ProjectTimeEntriesFilters = {
	limit?: number;
	offset?: number;
	order?: {
		field: string;
		sortAs: string;
	};
};

export default async (
	workspace: Workspace,
	projectId: Project["id"],
	filters: ProjectTimeEntriesFilters,
	currentUser: User,
) => {
	const { limit, offset, order } = filters;

	const timeEntries = await db.query.timeEntryTable.findMany({
		where(fields, { and }) {
			return eq(fields.projectId, projectId);
		},
		with: {
			task: {
				with: {
					parent: true,
				},
			},
		},
		limit,
	});

	return timeEntries.map(toTTimeEntry);
};
