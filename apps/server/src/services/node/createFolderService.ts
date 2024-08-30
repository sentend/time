import { NodeType, User, Workspace } from "@/models";
import { createNode, NodeValues } from "@/models/node/methods";
import z from "zod";

const taskValues = z.object({
	parentId: z.string().nullable(),
	name: z.string().min(1),
	projectId: z.string(),
	type: z.literal(1).or(z.literal(0)),
});

//todo add here check on existing projct
export default async (workspace: Workspace, values: Record<string, unknown>, currentUser: User) => {
	let { parentId = null, name, projectId, type = NodeType.folder } = values;
	const effectiveValues = taskValues.parse({ parentId, name, projectId, type });

	const res = await createNode(effectiveValues as NodeValues);
	return res;
};
