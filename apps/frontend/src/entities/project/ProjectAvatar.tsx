import { config } from "@/shared/config";
import { Avatar } from "@/shared/ui";
import { cn, getInitials } from "@/shared/utils";
import React from "react";
import { TProject } from "~types/models";

type ProjectAvatarProps = {
	project: TProject;
};

const ProjectAvatar = ({ project }: ProjectAvatarProps) => {
	const name = getInitials(project.name);

	const bgColor = config.colors[project.colorId]!.bg;

	return (
		<Avatar
			className={bgColor}
			fallbackProps={{
				className: cn("text-white opacity-75 font-bold text-[1rem]", bgColor),
			}}
			fallbackText={name}
		/>
	);
};

export default ProjectAvatar;
