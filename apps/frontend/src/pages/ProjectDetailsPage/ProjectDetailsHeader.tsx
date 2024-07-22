import { ProjectAvatar } from "@/entities/project";
import { Text } from "@/shared/ui";
import { ProjectDropdownButton } from "@/widgets";
import { useParams } from "react-router";
import { TProject } from "~types/models";

type ProjectDetailsHeaderProps = {
	project: TProject;
};

//todo optimize
const ProjectDetailsHeader = ({ project }: ProjectDetailsHeaderProps) => {
	const { projectId } = useParams<{ projectId: string }>();

	if (!project) {
		return null;
	}

	return (
		<div className="w-full flex justify-between mb-10 mt-7">
			<div className="flex gap-5 items-end">
				<ProjectAvatar project={project} />
				<div className="flex flex-col gap-[5px]">
					{project.client?.name && (
						<Text size={"xs"} className="font-bold text-tertiary">
							{project.client?.name}
						</Text>
					)}
					<Text variant={"primary"} className="text-[26px] cursor-pointer">
						{project.name}
					</Text>
				</div>
			</div>

			<ProjectDropdownButton projectId={projectId!} />
		</div>
	);
};

export default ProjectDetailsHeader;
