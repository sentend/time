import pick from "lodash/pick";
import { Workspace } from "../workspace";
import type { TWorkspace } from "~types/models";

export default (workspace: Workspace): TWorkspace => {
	return {
		...pick(workspace, ["id", "name", "nextProjectColorId"]),
		avatarFilename: workspace.avatarFilename || undefined,
		createdAt: workspace.createdAt.getTime(),
		updatedAt: workspace.updatedAt.getTime(),
	};
};
