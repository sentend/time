import { User, Workspace } from "@/models";
import toIUser from "@/models/user/methods/toIUser";
import { db } from "@/db";

export default async (workspace: Workspace, stringValue: string, user: User) => {
	const usersId = await db.query.userWorkspaceTable.findMany({
		where(fields, { eq }) {
			return eq(fields.workspaceId, workspace.id);
		},
		columns: {
			userId: true,
		},
	});

	const users = await db.query.userTable.findMany({
		where(fields, { or, ilike, and, inArray }) {
			return and(
				or(
					ilike(fields.name, stringValue),
					ilike(fields.initials, stringValue),
					ilike(fields.email, stringValue),
				),
				inArray(
					fields.id,
					usersId.map(item => item.userId),
				),
			);
		},
	});

	return users.map(toIUser);
};
