import { CreateProjectForm } from "@/features/project/create-project";
import { useTranslation } from "react-i18next";
import { Button } from "@/shared/ui/button";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { useUnit } from "effector-react";
import { $buttonText, $isDialogOpen, $titleText, toggleDialog } from "../model";

export const ProjectEditor = () => {
	const { t } = useTranslation();

	const [isDialogOpen, handleToggleDialog, buttonText, titleText] = useUnit([
		$isDialogOpen,
		toggleDialog,
		$buttonText,
		$titleText,
	]);

	return (
		<Dialog onOpenChange={handleToggleDialog} open={isDialogOpen}>
			<DialogContent className="p-8 max-w-dialog">
				<DialogHeader className="font-bold text-xl">
					<DialogTitle>{titleText}</DialogTitle>
				</DialogHeader>
				<div>
					<CreateProjectForm />
					<div className="flex justify-end mt-9 gap-4">
						<DialogClose asChild>
							<Button type="button">{t("cancel")}</Button>
						</DialogClose>
						<Button form="project-form" variant="primary" type="submit">
							{buttonText}
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};
