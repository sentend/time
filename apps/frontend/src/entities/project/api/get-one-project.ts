import type { ProjectDTO } from "server/project";
import { apiClient } from "@/shared/api";

export const getProjectById = async (projectId: string, workspaceId: number) => {
	const res = await apiClient.request<ProjectDTO>("GET", `/${workspaceId}/projects/${projectId}`);

	return res;
};
