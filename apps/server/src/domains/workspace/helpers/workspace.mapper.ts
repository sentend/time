import type { Workspace } from "../workspace.entity";
import { pick } from "@/libs/pick";
import type { WorkspaceModel } from "../workspace.model";

export class WorkspaceMapper {
	public static toModel(entity: Workspace): WorkspaceModel {
		return pick<Workspace, keyof WorkspaceModel>(entity, [
			"id",
			"name",
			"nextProjectColorId",
			"avatarFilename",
			"createdAt",
		]);
	}
}
