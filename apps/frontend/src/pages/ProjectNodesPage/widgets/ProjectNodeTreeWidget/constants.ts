import { TFolder, TNode, TTask } from "~types/models";

export const NodeTypes = ["task", "folder"];

export enum NodeType {
	task = 0,
	folder = 1,
}

export type TNodeExtension = {
	effectiveColorId: number;
};

export type TNodeExtended = TNode & TNodeExtension;

export type TTaskExtended = TTask & TNodeExtension;

export type TFolderExtended = TFolder & TNodeExtension;
