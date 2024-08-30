import type { ProjectDTO } from "@/server/project";
import { apiClient } from "@/shared/api";

export const createProject = async (workspaceId: number, data: unknown): Promise<ProjectDTO> => {
	const res = await apiClient.request<ProjectDTO>("POST", `/${workspaceId}/projects`, {
		data,
	});

	return res.data;
};

export const getProjects = async (
	workspaceId: number,
	filter?: { archived?: boolean }
): Promise<ProjectDTO[]> => {
	const params: Record<string, unknown> = {};

	if (filter) {
		params.archived = filter.archived;
	}

	const res = await apiClient.request<ProjectDTO[]>("GET", `/${workspaceId}/projects`, {
		params,
	});

	console.log(res.data);
	return res.data;
};

// getProjectNodes = async (projectId: string, params: { q: string }) => {
// 	const res = await this.request<NodeModel[]>(
// 		"GET",
// 		`/${this.workspaceId}/projects/${projectId}/nodes`,
// 		{
// 			params,
// 		}
// 	);

// 	return res.data;
// };

// getTimeEntriesProject = async (
// 	projectId: string,
// 	params?: { q?: string; limit?: number; offset?: number }
// ) => {
// 	const res = await this.request<TTimeEntry[]>(
// 		"GET",
// 		`/${this.workspaceId}/projects/${projectId}/time-entries`,
// 		{
// 			params,
// 		}
// 	);

// 	return res.data;
// };

// updateProject = async (projectId: string, data: unknown): Promise<ProjectModel> => {
// 	const res = await this.request<ProjectModel>(
// 		"PUT",
// 		`/${this.workspaceId}/projects/${projectId}`,
// 		{
// 			data,
// 		}
// 	);
// 	return res.data;
// };

// getOneProject = async (projectId: string): Promise<ProjectModel> => {
// 	const res = await this.request<ProjectModel>(
// 		"GET",
// 		`/${this.workspaceId}/projects/${projectId}`
// 	);

// 	return res.data;
// };

// getProjectMembersSearch = async (search: string): Promise<GetProjectMembersSearch.Member[]> => {
// 	const res = await this.request<GetProjectMembersSearch.Member[]>(
// 		"GET",
// 		`/${this.workspaceId}/projects/members/search`,
// 		{
// 			params: {
// 				search,
// 			},
// 		}
// 	);

// 	return res.data;
// };
