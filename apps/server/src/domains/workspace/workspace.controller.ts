import { workspaceService, type WorkspaceService } from "./workspace.service";

class WorkspaceController {
	constructor(readonly workspaceService: WorkspaceService) {}
}

export const workspaceController = new WorkspaceController(workspaceService);
