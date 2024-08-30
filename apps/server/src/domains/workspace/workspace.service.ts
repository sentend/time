import { NUMBER_OF_COLORS } from "@/config";
import type { Workspace } from "./workspace.entity";
import {
	workspaceRepository,
	type IWorkspaceRepository,
} from "./workspace.repository";
import { HTTPError } from "@/libs/httpError";

export class WorkspaceService {
	constructor(readonly workspaceRepository: IWorkspaceRepository) {}

	async updateColor(id: Workspace["id"]) {
		const workspace = await this.workspaceRepository.findById(id);

		if (!workspace) {
			throw new HTTPError(404, { message: "NoSuchWorkspace" });
		}

		const nextProjectColorId =
			(workspace.nextProjectColorId + 1) % NUMBER_OF_COLORS;

		await this.workspaceRepository.updateWorkspaceById(id, {
			nextProjectColorId,
		});
	}
}

export const workspaceService = new WorkspaceService(workspaceRepository);
