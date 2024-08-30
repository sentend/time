import { db } from "@/db";
import type { WorkspaceMember } from "./workspaceMember.entity";

export interface IWorkspaceMemberRepository {
	getByUserIdAndWorkspaceId(
		userId: string,
		workspaceId: number,
	): Promise<WorkspaceMember | undefined>;
}

export class WorkspaceMemberRepository implements IWorkspaceMemberRepository {
	getByUserIdAndWorkspaceId(userId: string, workspaceId: number) {
		const userWorkspace = db.query.userWorkspaceTable.findFirst({
			where: (t, { eq, and }) =>
				and(eq(t.userId, userId), eq(t.workspaceId, workspaceId)),
		});

		return userWorkspace;
	}
}

export const workspaceMemberRepository = new WorkspaceMemberRepository();
