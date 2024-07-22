import { cacheKeyGenerator } from "@/shared/utils";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { ProjectDetailsPageParams } from "../ProjectDetailsPage/ProjectDetailsPage";
import { apiClient } from "@/shared/api";
import { useTranslation } from "react-i18next";
import { getColumns } from "./columns";
import { useSearchParams } from "react-router-dom";
import { TimeEntriesTable } from "./widgets/TimeEntriesTableWidget";

const timeEntriesKeys = cacheKeyGenerator("timeEntries");

const ProjectTimeEntries = () => {
	const { t } = useTranslation();
	const { projectId } = useParams<ProjectDetailsPageParams>();
	const [searchParams, setSearchParams] = useSearchParams();

	const { data: timeEntries } = useQuery({
		queryKey: [timeEntriesKeys.all, projectId],
		queryFn: async () => {
			const res = await apiClient.getTimeEntriesProject(projectId!, { limit: 15 });
			console.log(res);
			return res;
		},
		refetchOnWindowFocus: false,
	});

	if (!timeEntries?.length) {
		return t("timeEntries.empty");
	}

	return (
		<div>
			<TimeEntriesTable
				columns={getColumns(t, searchParams, setSearchParams)}
				data={timeEntries}
				cellClassName="py-[6.5px]"
			/>
		</div>
	);
};

export default ProjectTimeEntries;
