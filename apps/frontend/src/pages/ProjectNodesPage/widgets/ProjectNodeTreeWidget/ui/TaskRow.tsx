import { ReactNode } from "react";

import { Text } from "@/shared/ui";
import { TNode, TTask } from "~types/models";
import { IconCompleted } from "@/shared/assets";
import { DurationDisplay } from "@/entities/node";
import { cn, highlitedSubstring } from "@/shared/libs";
import StartPauseButton from "@/shared/ui/start-pause-button/StartPauseButton";

import { TTaskExtended } from "../constants";

type TaskRowProps = {
	task: TTaskExtended;
	onRowClick: (task: TNode) => void;
	onStartPauseClick: (task: TTask) => void;
	isRunning: boolean;
	searchString?: string;
	className?: string;
};

const TaskRow = ({
	task,
	onRowClick,
	onStartPauseClick,
	isRunning,
	searchString,
	className,
}: TaskRowProps) => {
	let nodeName: ReactNode = task.name;
	if (searchString) {
		nodeName = highlitedSubstring(task.name, searchString);
	}

	return (
		<div
			className={cn(
				"w-full rounded-lg flex group items-center gap-3 cursor-grab pr-3 py-2",
				className
			)}
			onClick={() => {
				onRowClick(task);
			}}
		>
			{!task.isCompleted && (
				<StartPauseButton
					size="md"
					colorId={task.effectiveColorId}
					isRunning={isRunning}
					onClick={() => {
						onStartPauseClick(task);
					}}
				/>
			)}

			{task.isCompleted && <IconCompleted className="stroke-tm-color-5" width={20} height={20} />}

			<Text truncate variant="subtle" asChild className={cn("min-w-0 flex-[1] font-medium")}>
				<div>{nodeName}</div>
			</Text>

			<DurationDisplay duration={task.confirmedDuration} />
		</div>
	);
};

export default TaskRow;
