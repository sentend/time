import { User, Workspace } from "@/models";
import { getClientsMethod } from "@/models/client/methods";
import { getProjectMembersSearch } from "@/models/project/methods";
import { parseQSToStringArray } from "@/utils";

type Filters = {
	searchText: string;
};
export default async (workspace: Workspace, filter: Filters, currentUser: User) => {
	const search = `%${filter.searchText}%`;

	const clients = await getClientsMethod(workspace, { search }, currentUser);
	return clients;
};
