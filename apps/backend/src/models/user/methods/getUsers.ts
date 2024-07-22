import { Workspace } from "../../../models";
import { db } from "@/db";
import toIUser from "./toIUser";
import { TUser } from "../../../../../types/models";

export const getUsers = async (
	workspace: Workspace,
	filters?: Record<string, string>,
	sorting?: Record<string, string>,
	paging?: Record<string, string>
): Promise<TUser[]> => {
	const userIds = await db.query.userWorkspaceTable.findMany({
		columns: {
			userId: true,
		},
		where(fields, { eq, and }) {
			return and(eq(fields.workspaceId, workspace.id));
		},
	});

	const users = await db.query.userTable.findMany({
		where(fields, { inArray }) {
			return inArray(
				fields.id,
				userIds.map(user => user.userId)
			);
		},
	});

	return users.map(toIUser);
};
