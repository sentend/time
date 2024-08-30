import { User, Workspace } from "@/models";
import { createNode, NodeValues } from "@/models/node/methods";
import z from "zod";

const taskValues = z.object({
	parentId: z.string().nullable(),
	name: z.string().min(1),
	projectId: z.string(),
});

//todo add here check on existing projct
export default async (workspace: Workspace, values: Record<string, unknown>, currentUser: User) => {
	const { parentId, name, projectId, colorId } = values;

	const effectiveValues = taskValues.parse({ parentId, name, projectId });

	const res = await createNode(effectiveValues as NodeValues);
	return res;
};
