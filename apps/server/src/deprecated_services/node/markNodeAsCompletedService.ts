import { Node, User, Workspace } from "@/models";
import { markNodeAsCompleted } from "@/models/node/methods";
import { updateValues } from "@/utils";

export default async (workspace: Workspace, nodeId: Node["id"], currentUser: User) => {
	const values = updateValues({ isCompleted: true });
	const res = await markNodeAsCompleted(workspace, nodeId, values, currentUser);
	return res;
};
