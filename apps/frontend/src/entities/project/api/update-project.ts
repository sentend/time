import type { ProjectDTO } from "server/project";
import { apiClient } from "@/shared/api";

export const updateProject = async (workspaceId: number, projectId: string) => {
	const res = await apiClient.request<ProjectDTO>("GET", `/${workspaceId}/projects/${projectId}`);

	return res;
};
