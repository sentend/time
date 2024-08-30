import type { Nullable } from "~types/supportTypes";

export type NodeModel = {
	id: string;
	name: string;
	type: number;
	colorId?: number;
	order: number;
	confirmedDuration: number;
	projectId: string;
	parentId: Nullable<string>;
	createdAt: Date;
	updatedAt: Date;
};
