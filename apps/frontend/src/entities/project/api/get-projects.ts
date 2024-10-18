import type { ProjectLightDTO } from "server/project";
import { apiClient } from "@/shared/api";

type GetProjectsParams = {
	workspaceId: number;
	page: number;
};

export const getProjects = async ({ workspaceId, page }: GetProjectsParams) => {
	const params = {
		page,
	};

	const res = await apiClient.request<ProjectLightDTO[]>("GET", `/${workspaceId}/projects`, {
		params,
	});

	return res;
};
