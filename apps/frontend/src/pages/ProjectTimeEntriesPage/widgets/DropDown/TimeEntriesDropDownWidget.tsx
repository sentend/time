import { DotsIcon } from "@/shared/assets";
import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, Text } from "@/shared/ui";
import { ProjectEditor } from "@/widgets";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

type ProjectDropdownButtonProps = {
	timeEntryId: string;
	onDelete: () => void;
	onMove: () => void;
	onDuplicate: () => void;
	onEdit: () => void;
};

const TimeEntriesDropDownWidget = ({
	timeEntryId,
	onDelete,
	onDuplicate,
	onEdit,
	onMove,
}: ProjectDropdownButtonProps) => {
	const { t } = useTranslation();

	const [isDialogOpen, setIsDialogOpen] = useState(false);

	return (
		<>
			<DropdownMenu modal>
				<DropdownMenuTrigger
					asChild
					onClick={(e) => {
						e.stopPropagation();
					}}
				>
					<Button size={"sm"} className="px-[10px] py-[6px] [&>*]:fill-gray-70">
						<DotsIcon width={20} height={20} />
					</Button>
				</DropdownMenuTrigger>

				<DropdownMenuContent
					align="end"
					onClick={(e) => {
						e.stopPropagation();
					}}
				>
					<DropdownMenuItem
						className="cursor-pointer"
						onClick={() => {
							setIsDialogOpen(true);
						}}
					>
						<Text>{t("duplicate")}</Text>
					</DropdownMenuItem>
					<DropdownMenuItem>
						<Text className="cursor-pointer">{t("move")}</Text>
					</DropdownMenuItem>
					<DropdownMenuItem>
						<Text className="cursor-pointer">{t("edit")}</Text>
					</DropdownMenuItem>
					<DropdownMenuItem>
						<Text className="cursor-pointer" variant={"error"}>
							{t("delete")}
						</Text>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
};

export default TimeEntriesDropDownWidget;
