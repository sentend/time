import { TNode } from "~types/models";
import { Node } from "../node";

const toTNode = (node: Node): TNode => {
	return {
		...node,
		order: parseFloat(node.order),
	};
};

export default toTNode;
