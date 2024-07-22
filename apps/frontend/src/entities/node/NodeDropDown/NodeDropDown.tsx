import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogTrigger,
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	Text,
} from "@/shared/ui";
import { useTranslation } from "react-i18next";
import { UseMutateFunction } from "@tanstack/react-query";
import { cn } from "@/shared/utils";
import { useState } from "react";
import { DotsIcon } from "@/shared/assets";

type NodeDropDownProps = {
	onDelete: UseMutateFunction;
	onComplete?: UseMutateFunction;
	folder: boolean;
	className?: string;
};

const NodeDropDown = ({ onDelete, onComplete, folder, className }: NodeDropDownProps) => {
	const [isActive, setIsActive] = useState(false);

	return (
		<div
			className={cn("flex items-center", className, {
				"opacity-100": isActive,
			})}
		>
			<DropdownMenu onOpenChange={setIsActive} modal={false}>
				<DropdownMenuTrigger asChild>
					<Button
						onClick={(e) => {
							e.stopPropagation();
						}}
						size={"sm"}
						variant={"ghost"}
						className="px-[10px] py-[6px]"
					>
						<DotsIcon width={16} height={16} className="fill-gray-30" />
					</Button>
				</DropdownMenuTrigger>
				{folder ? (
					<FolderDropDownMenuItems onDelete={onDelete} />
				) : (
					<TaskDropDownMenuItems onDelete={onDelete} onComplete={onComplete} />
				)}
			</DropdownMenu>
		</div>
	);
};

export default NodeDropDown;

type ItemsProps = {
	onDelete: UseMutateFunction;
	onComplete?: UseMutateFunction;
};

const TaskDropDownMenuItems = ({ onDelete, onComplete }: ItemsProps) => {
	const { t } = useTranslation();

	return (
		<DropdownMenuContent align="end">
			<DropdownMenuItem className="cursor-pointer" onClick={() => onComplete?.()}>
				<Text>{t("task.markAsCompleted")}</Text>
			</DropdownMenuItem>
			<DropdownMenuItem className="cursor-pointer">
				<Text>{t("task.markAsOpen")}</Text>
			</DropdownMenuItem>
			<AlertDialog>
				<AlertDialogTrigger asChild>
					<DropdownMenuItem
						className="cursor-pointer"
						onSelect={(e) => {
							e.preventDefault();
						}}
					>
						<Text variant={"error"}>{t("task.delete")}</Text>
					</DropdownMenuItem>
				</AlertDialogTrigger>
				<AlertDialogContent title={t("warning")} description={t("task.alertMessage")}>
					<AlertDialogFooter>
						<AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
						<AlertDialogAction onClick={() => onDelete()}>{t("continue")}</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</DropdownMenuContent>
	);
};

const FolderDropDownMenuItems = ({ onDelete }: ItemsProps) => {
	const { t } = useTranslation();

	return (
		<DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
			<DropdownMenuItem className="cursor-pointer">
				<Text>{t("folder.edit")}</Text>
			</DropdownMenuItem>
			<AlertDialog>
				<AlertDialogTrigger asChild>
					<DropdownMenuItem
						className="cursor-pointer"
						onSelect={(e) => {
							e.preventDefault();
						}}
						onClick={(e) => {
							e.stopPropagation();
						}}
					>
						<Text variant={"error"}>{t("folder.delete")}</Text>
					</DropdownMenuItem>
				</AlertDialogTrigger>
				<AlertDialogContent title={t("warning")} description={t("folder.alertMessage")}>
					<AlertDialogFooter>
						<AlertDialogCancel>
							<Text>{t("cancel")}</Text>
						</AlertDialogCancel>
						<AlertDialogAction onClick={() => onDelete()}>
							<Text variant={"error"}>{t("continue")}</Text>
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</DropdownMenuContent>
	);
};
