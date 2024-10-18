import { User, Workspace } from "@/models";
import { deleteNode } from "@/models/node/methods";

export default async (workspace: Workspace, nodeId: string, currentUser: User) => {
	const res = await deleteNode(nodeId);
	return res;
};
