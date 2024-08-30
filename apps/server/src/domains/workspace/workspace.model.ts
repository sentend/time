import type { Nullable } from "~types/supportTypes";

export type WorkspaceDTO = {
	id: number;
	name: string;
	avatarFilename: Nullable<string>;
	nextProjectColorId: number;
	createdAt: Date;
	updatedAt: Date;
};
