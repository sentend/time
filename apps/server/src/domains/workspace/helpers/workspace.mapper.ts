import type { Workspace } from "../workspace.entity";
import { pick } from "@/libs/pick";
import type { WorkspaceDTO } from "../workspace.model";

export class WorkspaceMapper {
	public static toModel(entity: Workspace): WorkspaceDTO {
		return pick<Workspace, keyof WorkspaceDTO>(entity, [
			"id",
			"name",
			"nextProjectColorId",
			"avatarFilename",
			"createdAt",
		]);
	}
}
