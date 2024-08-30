import { MouseEvent, useMemo } from "react";

import { useTranslation } from "react-i18next";

import { Row } from "@tanstack/react-table";
import { DataTable } from "@/shared/ui/DataTable/DataTable";

import { getColumns } from "./columns";
import { GetProjectsService } from "~types/services";
import { useProjects } from "@/entities/project";
import { useAtomValue } from "jotai";
import { currentWorkspaceAtom } from "@/shared/config";

export type ProjectListFilter = {
	archived?: boolean;
};

export type ProjectTableProps = {
	filter: ProjectListFilter;
	onRowClick: (project: GetProjectsService.ProjectItem) => void;
	onActionsClick: (e: MouseEvent<HTMLButtonElement>, projectId: string) => void;
};

const ProjectListWidget = (props: ProjectTableProps) => {
	const { filter, onRowClick, onActionsClick } = props;
	const currentWorkspace = useAtomValue(currentWorkspaceAtom);

	const { t } = useTranslation();
	const columns = useMemo(() => getColumns(t, onActionsClick), [t]);

	const { data, isLoading } = useProjects(currentWorkspace!.id, { size: 10, page: 1 });

	const handleRowClick = (row: Row<GetProjectsService.ProjectItem>) => {
		onRowClick(row.original);
	};

	if (isLoading) {
		return "...Loading...";
	}

	if (!data?.length) {
		return "no projects";
	}

	return <DataTable columns={columns} data={data} onRowClick={handleRowClick} />;
};

export default ProjectListWidget;
