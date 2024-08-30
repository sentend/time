import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { ProjectListFilter } from "./ProjectListWidget";
import { GetProjectsService } from "~types/services";
import { getProjects } from "@/entities/project";

export default ({
	filter,
	options,
}: {
	filter?: ProjectListFilter;
	options?: Partial<UseQueryOptions<GetProjectsService.ProjectItem[]>>;
}) => {
	return useQuery({
		queryKey: ["projects", filter],
		queryFn: async () => await getProjects(filter),
		retry: false,
		refetchOnWindowFocus: false,
		...options,
	});
};
