import type { ProjectDTO } from "server/project";
import { apiClient, queryClient } from "@/shared/api";

import { useMutation, useQuery } from "@tanstack/react-query";
import type { CreateProjectParams } from "./create-project";

export type ProjectsFilter = {
	isArchived?: boolean;
	page: number;
	size: number;
};

export const useProjects = (workspaceId: number, { page, size }: ProjectsFilter) => {
	return useQuery({
		queryKey: ["projects", workspaceId, size, page],
		queryFn: async () => {
			const params = {
				page,
				size,
			};

			const res = await apiClient.request<ProjectDTO[]>("GET", `/${workspaceId}/projects`, {
				params,
			});

			console.log(res.data);
			return res.data;
		},
		retry: 3,
		refetchOnWindowFocus: false,
	});
};

export const useCreateProject = () => {
	const {
		mutate: createProject,
		isSuccess: isCreated,
		isPending: isCreationPending,
		...rest
	} = useMutation({
		mutationKey: ["projects", "create"],
		mutationFn: async ({ workspaceId, data }: CreateProjectParams) => {
			const res = await apiClient.request<ProjectDTO>("POST", `/${workspaceId}/projects`, {
				data,
			});

			return res.data;
		},
	});

	return {
		createProject,
		isCreated,
		isCreationPending,
		...rest,
	};
};

export const useUpdateProject = () => {
	const {
		mutate: updateProject,
		isPending: isUpdateLoading,
		...rest
	} = useMutation({
		mutationKey: ["update", "project"],
		mutationFn: async ({ workspaceId, data }: CreateProjectParams) => {
			const res = await apiClient.request<ProjectDTO>(
				"PUT",
				`/${workspaceId}/projects/${data.id}`,
				{
					data,
				}
			);
			return res.data;
		},
		onSuccess(data) {
			queryClient.setQueriesData(
				{ queryKey: ["projects"] },
				(oldData: GetProjectsService.ProjectItem[] | undefined) => {
					let res = oldData;
					if (oldData?.length) {
						const effectiveOldData = [...oldData];
						const index = effectiveOldData.findIndex((project) => project.id === data.id);

						const project = effectiveOldData.at(index)!;

						const updatedProject = {
							...project,
							...pick(data, keys(project)),
							clientName: data.client?.name ?? null,
						};

						effectiveOldData.splice(index, 1, updatedProject);
						res = effectiveOldData;
					}

					return res;
				}
			);
		},
	});

	return {
		update: updateProject,
		isUpdateLoading,
		...rest,
	};
};

export const useGetProjectById = (projectId: string, workspaceId: number) => {
	const {
		data: project,
		isLoading: isProjectLoading,
		isSuccess: isProjectSuccessfullyLoaded,
		...rest
	} = useQuery({
		queryKey: ["project", projectId, workspaceId],
		queryFn: async () => {
			const res = await apiClient.request<ProjectDTO>(
				"GET",
				`/${workspaceId}/projects/${projectId}`
			);

			return res;
		},
		enabled: !!projectId,
		gcTime: 0,
	});

	return {
		project,
		isProjectLoading,
		isProjectSuccessfullyLoaded,
		...rest,
	};
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
