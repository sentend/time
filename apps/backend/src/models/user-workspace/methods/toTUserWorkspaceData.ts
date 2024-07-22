import pick from "lodash/pick";
import { UserWorkspace } from "../userWorkspace";
import type { TUserWorkspaceData } from "~types/models";

export default (userWorkspace: UserWorkspace): TUserWorkspaceData => {
	return {
		...pick(userWorkspace, [
			"workspaceId",
			"userId",
			"isOwner",
			"isAdmin",
			"canCreateProjects",
			"isActive",
			"firstDayOfWeek",
			"currentTaskId",
			"currentTimeEntryId",
		]),
	};
};
