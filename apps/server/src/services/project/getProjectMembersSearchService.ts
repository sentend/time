import { User, Workspace } from "@/models";
import { getProjectMembersSearch } from "@/models/project/methods";
import { parseQSToStringArray } from "@/utils";

export default async (workspace: Workspace, search: string, user: User) => {
	const queryString = `%${search}%`;

	const a = await getProjectMembersSearch(workspace, queryString, user);
	return a;
};
