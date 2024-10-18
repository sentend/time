import type { NewProjectDTO, ProjectDTO } from "server/project";
import { apiClient } from "@/shared/api";

export type CreateProjectParams = {
	workspaceId: number;
	data: NewProjectDTO;
};

export const createProject = async ({ workspaceId, data }: CreateProjectParams) => {
	const res = await apiClient.request<ProjectDTO>("POST", `/${workspaceId}/projects`, {
		data,
	});

	return res;
};
