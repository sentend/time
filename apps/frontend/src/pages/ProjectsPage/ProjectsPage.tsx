import { useState } from "react";

import ProjectListWidget from "@/widgets/ProjectList/ProjectListWidget";

import CreateProject from "@/widgets/ProjectEdit/CreateProject";
import { GetProjectsService } from "~types/services";
import { useNavigate } from "react-router";
import useCurrentWorkspace from "@/shared/hooks/useCurrentWorkspace";

const ProjectsPage = () => {
	const [selectedProjectId, setSelectedProjectId] = useState<
		GetProjectsService.ProjectItem["id"] | undefined
	>();
	const [isArchived, setIsArchived] = useState<boolean | undefined>(undefined);

	const navigate = useNavigate();
	const currentWorkspace = useCurrentWorkspace();

	const handleRowClick = (project: GetProjectsService.ProjectItem) => {
		console.log(project);
		navigate(`/${currentWorkspace.id}/projects/${project.id}/tasks`);
	};

	return (
		<div className="flex flex-col gap-10 w-full">
			<div className="flex justify-end gap-[100px]">
				<div className="flex gap-3">
					<div>qqwqw</div>
					<div>qwqw</div>
				</div>
				<CreateProject setSelectedProjectId={setSelectedProjectId} projectId={selectedProjectId} />
			</div>

			<ProjectListWidget
				onActionsClick={(e, projectId) => {
					e.stopPropagation();
					setSelectedProjectId(projectId);
				}}
				onRowClick={handleRowClick}
				filter={{ archived: isArchived }}
			/>
		</div>
	);
};

export default ProjectsPage;
