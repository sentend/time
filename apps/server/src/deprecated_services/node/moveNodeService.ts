import { User, Workspace } from "@/models";
import { type MoveNodeValues, moveNode } from "@/models/node/methods";

export default async (
	workspace: Workspace,
	nodeId: string,
	values: MoveNodeValues,
	currentUser: User,
) => {
	const effectiveValues: Record<string, unknown> = {};
	if (values.order) {
		effectiveValues.order = String(values.order);
	}

	if (values.parentId !== undefined) {
		effectiveValues.parentId = values.parentId;
	}
	const res = await moveNode(nodeId, effectiveValues);

	return res;
};
