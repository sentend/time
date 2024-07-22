import { User, Workspace } from "@/models";
import { db } from "@/db";

export default async (workspace: Workspace, filter: { search: string }, currentUser: User) => {
	const clients = await db.query.clientTable.findMany({
		where(fields, { ilike, and, eq }) {
			return and(ilike(fields.name, filter.search), eq(fields.workspaceId, workspace.id));
		},
	});

	return clients;
};
