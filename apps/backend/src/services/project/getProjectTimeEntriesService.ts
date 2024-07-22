import { Project, User, Workspace } from "@/models";
import {
	type ProjectTimeEntriesFilters,
	getProjectTimeEntries,
} from "@/models/project/methods";

export default async (
	workspace: Workspace,
	projectId: Project["id"],
	filters: Record<string, any>,
	currentUser: User,
) => {
	const effectiveFilters: ProjectTimeEntriesFilters = {
		limit: filters.limit,
		offset: filters.offset,
	};
	const timeEntries = await getProjectTimeEntries(
		workspace,
		projectId,
		effectiveFilters,
		currentUser,
	);
	return timeEntries;
};
