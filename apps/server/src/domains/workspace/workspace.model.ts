import type { Nullable } from "~types/supportTypes";

export type WorkspaceModel = {
	id: number;
	name: string;
	avatarFilename: Nullable<string>;
	nextProjectColorId: number;
	createdAt: Date;
	updatedAt: Date;
};
