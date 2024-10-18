import { cn } from "@/shared/libs";
import { COLORS } from "@/shared/config";
import { $projects, getProjectsFx, projectClick } from "../model";
import { useEffect } from "react";
import { useUnit } from "effector-react";

type Props = {
	onProjectClick: (projectId: string) => void;
};

export const ProjectList = ({ onProjectClick }: Props) => {
	const projects = useUnit($projects);

	useEffect(() => {
		getProjectsFx();
	}, []);

	const handleClick = (projectId: string) => () => {
		projectClick(projectId);
	};

	return (
		<div className="w-full space-y-3">
			{projects.map((project) => {
				return (
					<div
						className={cn(
							" rounded p-4 flex items-center cursor-pointer hover:bg-slate-100 border-2 border-solid",
							COLORS.colors[project.colorId]?.border
						)}
						onClick={handleClick(project.id)}
						key={project.id}
					>
						{project.name}
					</div>
				);
			})}
		</div>
	);
};
