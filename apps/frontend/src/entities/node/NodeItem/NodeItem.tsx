import { FolderIcon, IconArrowRight, IconCompleted } from "@/shared/assets";
import { config } from "@/shared/config";
import { Text } from "@/shared/ui";
import { cn, highlitedSubstring } from "@/shared/utils";
import StartPauseButton from "@/shared/ui/StaretPauseButton/StartPauseButton";
import { DurationDisplay } from "@/entities/node";
import { ReactNode, useState } from "react";
import {
	NodeType,
	TNodeExtended,
} from "@/pages/ProjectNodesPage/widgets/ProjectNodeTreeWidget/constants";

type NodeItemProps = {
	className?: string;
	onRowClick?: () => void;
	node: TNodeExtended;
	searchString?: string;
};

const NodeItem = ({ className, node, onRowClick, searchString }: NodeItemProps) => {
	const isFolder = node.type === NodeType.folder;

	const [isFolderExpanded, setIsFolderExpanded] = useState(false);

	let nodeName: ReactNode = node.name;
	if (node.parentId === null && searchString) {
		nodeName = highlitedSubstring(node.name, searchString);
	}

	return (
		<div
			className={cn("w-full rounded-lg flex group items-center gap-3 cursor-grab pr-3", className, {
				"py-2": !isFolder,
				"py-[9px]": isFolder,
			})}
			onClick={() => {
				if (isFolder) {
					setIsFolderExpanded((prev) => !prev);
				}
				onRowClick?.();
			}}
		>
			{isFolder && (
				<>
					<IconArrowRight
						width={24}
						height={24}
						className={cn("stroke-gray-30 transition-all ", {
							"rotate-90": isFolderExpanded,
						})}
					/>
					<FolderIcon width={26} height={26} className={cn("", config.colors[colorId]?.fill)} />
				</>
			)}

			{/*//? should be widget? */}
			{!isFolder && (
				<StartPauseButton
					size="md"
					colorId={colorId}
					isRunning={false}
					onClick={() => {
						console.log("toggle");
					}}
				/>
			)}
			<Text
				truncate
				variant={"subtle"}
				className={cn("min-w-0 flex-[1]", {
					"font-semibold": isFolder,
					"font-medium": !isFolder,
				})}
				asChild
			>
				<div>{nodeName}</div>
			</Text>
			{node.isCompleted && <IconCompleted className="stroke-tm-color-5" width={20} height={20} />}
			<DurationDisplay duration={node.confirmedDuration} />
		</div>
	);
};

export default NodeItem;
