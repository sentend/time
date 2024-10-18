import type { WorkspaceDTO } from "server/workspace";
import { apiClient } from "../api-client";
import type { UserDTO } from "server/user";

export type MeDTO = {
	user: UserDTO;
	workspace: WorkspaceDTO;
	workspaces: WorkspaceDTO[];
};

export const getMe = async (lastUsedWorkspace: string | null) => {
	const result = await apiClient.request<MeDTO>("GET", `/me?workspaceId=${lastUsedWorkspace}`);

	return result;
};
