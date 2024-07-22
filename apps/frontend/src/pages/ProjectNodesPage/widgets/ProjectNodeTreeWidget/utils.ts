import { TNode } from "~types/models";

export const hasChildNodes = (parentId: string, nodes: TNode[] = []) => {
	return !!nodes.filter((node) => node.parentId === parentId).length;
};
