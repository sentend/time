import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/shared/ui";

import ProjectEditor from "./ProjectEditor";

import { GetProjectsService } from "~types/services";
import { TProject } from "~types/models";

const CreateProject = ({
	projectId,
	setSelectedProjectId,
}: {
	projectId?: TProject["id"];
	setSelectedProjectId: Dispatch<SetStateAction<TProject["id"] | undefined>>;
}) => {
	const { t } = useTranslation();

	const [isDialogOpen, setIsDialogOpen] = useState(false);

	useEffect(() => {
		if (projectId) {
			setIsDialogOpen(true);
		}
	}, [projectId]);

	return (
		<>
			<Button
				variant={"primary"}
				onClick={() => {
					setIsDialogOpen(true);
				}}
			>
				{t("project.new")}
			</Button>

			{isDialogOpen && (
				<ProjectEditor
					projectId={projectId}
					closeDialog={() => setIsDialogOpen(false)}
					onCloseDialog={() => setSelectedProjectId(undefined)}
				/>
			)}
		</>
	);
};

export default CreateProject;
