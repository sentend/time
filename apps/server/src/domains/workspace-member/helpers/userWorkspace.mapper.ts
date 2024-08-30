import { pick } from "@/libs/pick";
import type { WorkspaceMemberModel } from "../workspaceMember.model";
import type { WorkspaceMember } from "../workspaceMember.entity";

export class WorkspaceMemberMapper {
	public static toModel(entity: WorkspaceMember): WorkspaceMemberModel {
		return pick<WorkspaceMember, WorkspaceMemberModel>(entity, [
			"workspaceId",
			"userId",
			"isOwner",
			"isAdmin",
			"canCreateProjects",
			"isActive",
			"firstDayOfWeek",
			"currentTaskId",
			"currentTimeEntryId",
		]);
	}
}
