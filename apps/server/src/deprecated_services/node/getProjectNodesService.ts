import { User, Workspace } from "@/models";
import { parseQSToBoolean } from "@/utils";
import { ProjectNodesFilters } from "@/models/project/methods";
import getProjectNodes from "@/models/node/methods/getProjectNodes";

export default function getProjectNodesService(
	workspace: Workspace,
	projectId: string,
	filters: Record<string, any>,
	currentUser: User,
) {
	const effectiveFilters: ProjectNodesFilters = {
		q: `%${filters.q ?? ""}%`,
		isCompleted: parseQSToBoolean(filters?.isCompleted),
	};
	const nodes = getProjectNodes(projectId, effectiveFilters);
	return nodes;
}
