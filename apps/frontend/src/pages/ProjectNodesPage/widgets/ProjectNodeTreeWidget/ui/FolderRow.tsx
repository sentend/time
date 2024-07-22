import { ReactNode } from "react";

import { FolderIcon } from "lucide-react";

import { Text } from "@/shared/ui";
import { TNode } from "~types/models";
import { config } from "@/shared/config";
import { IconArrowRight } from "@/shared/assets";
import { DurationDisplay } from "@/entities/node";
import { cn, highlitedSubstring } from "@/shared/utils";

import { TNodeExtended } from "../constants";

type FolderRowProps = {
	folder: TNodeExtended;
	isRunning: boolean;
	searchString?: string;
	className?: string;
	isExpanded: boolean;
	onRowClick: (folder: TNode) => void;
};

const FolderRow = ({
	folder,
	isRunning,
	searchString,
	className,
	isExpanded,
	onRowClick,
}: FolderRowProps) => {
	let nodeName: ReactNode = folder.name;
	if (searchString) {
		nodeName = highlitedSubstring(folder.name, searchString);
	}

	return (
		<div
			className={cn(
				"w-full rounded-lg flex group items-center gap-3 cursor-grab pr-3 py-[9px]",
				className
			)}
			onClick={() => {
				onRowClick(folder);
			}}
		>
			<IconArrowRight
				width={24}
				height={24}
				className={cn("stroke-gray-30 transition-all ", {
					"rotate-90": isExpanded,
				})}
			/>

			<FolderIcon
				width={26}
				height={26}
				className={cn("", config.colors[folder.effectiveColorId]?.fill)}
			/>

			<Text truncate variant="subtle" asChild className={cn("min-w-0 flex-[1] font-semibold")}>
				<div>{nodeName}</div>
			</Text>

			<DurationDisplay duration={folder.confirmedDuration} />
		</div>
	);
};

export default FolderRow;
