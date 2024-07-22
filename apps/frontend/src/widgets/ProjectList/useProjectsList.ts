import { apiClient } from "@/shared/api";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { ProjectListFilter } from "./ProjectListWidget";
import { GetProjectsService } from "~types/services";

export default ({
	filter,
	options,
}: {
	filter?: ProjectListFilter;
	options?: Partial<UseQueryOptions<GetProjectsService.ProjectItem[]>>;
}) => {
	return useQuery({
		queryKey: ["projects", filter],
		queryFn: async () => await apiClient.getProjects(filter),
		retry: false,
		refetchOnWindowFocus: false,
		...options,
	});
};
