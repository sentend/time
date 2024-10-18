import { Suspense } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/shared/ui/button";
import { ProjectsList } from "@/entities/project/project-list";
import { ProjectEditor } from "@/widgets/project/project-editor";
import { toggleDialog } from "@/widgets/project/project-editor/model";
import { useUnit } from "effector-react";

export const ProjectsPage = () => {
	const { t } = useTranslation();

	const onToggleDialog = useUnit(toggleDialog);

	const handleClick = () => {
		onToggleDialog(true);
	};

	return (
		<div className="flex flex-col gap-10 w-full">
			<div className="flex justify-end gap-[100px]">
				<div className="flex gap-3"></div>
				<Button variant="primary" onClick={handleClick}>
					{t("project.new")}
				</Button>
				<ProjectEditor />
			</div>
			<div>
				<span className="text-5xl">some text</span>
			</div>
			<Suspense fallback="Loading...">
				<ProjectsList />
			</Suspense>
		</div>
	);
};
