import { useCurrentSegment } from "@/shared/hooks";
import { TabBar, TabsTrigger } from "@/shared/ui";

import { useTranslation } from "react-i18next";
import { Outlet, useNavigate, useParams } from "react-router";
import ProjectDetailsHeader from "./ProjectDetailsHeader";
import { cn } from "@/shared/libs";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/shared/api";
import { useProjects } from "@/entities/project";
import useCurrentWorkspace from "@/shared/hooks/useCurrentWorkspace";

export type ProjectDetailsPageParams = {
	projectId: string;
	workspaceId: string;
};

export type ProjectDetailsContext = {
	project?: TProject;
};

type Segment = "timeEntries" | "report" | "tasks";

export const ProjectDetails = () => {
	const currentWorkspace = useCurrentWorkspace();
	const { projectId } = useParams<ProjectDetailsPageParams>();
	const navigate = useNavigate();

	const { t } = useTranslation();

	const { isLoading, data: project } = useQuery({
		queryKey: ["project", projectId],
		queryFn: async () => {
			const res = await apiClient.getOneProject(projectId!);
			return res;
		},
		refetchOnWindowFocus: false,
	});

	const { data: projects } = useProjects(currentWorkspace.id, {
		page: 1,
		size: 10,
	});

	const segment = useCurrentSegment<Segment>() ?? "tasks";

	return (
		<div className="w-full">
			<ProjectDetailsHeader project={project!} />
			<TabBar
				value={segment}
				onValueChange={(value) => {
					navigate(`../${value}`, { relative: "path" });
				}}
			>
				<div className="flex">
					<TabsTrigger
						value="tasks"
						className={cn({ "hover:text-semi-primary": segment !== "tasks" })}
					>
						{t("task.plural")}
					</TabsTrigger>
					<TabsTrigger
						className={cn({ "hover:text-semi-primary": segment !== "timeEntries" })}
						value="timeEntries"
					>
						{t("timeEntries.plural")}
					</TabsTrigger>
					<TabsTrigger
						value="report"
						className={cn({ "hover:text-semi-primary": segment !== "report" })}
					>
						{t("report")}
					</TabsTrigger>
				</div>
			</TabBar>

			<Outlet context={{ project }} />
		</div>
	);
};

{
	/* <Tabs
				defaultValue={segment}
				className="w-full"
				onValueChange={(value) => {
					console.log(value);
					navigate(`../${value}`, { relative: "path" });
				}}
				onClick={(e) => {
					console.log(e.target);
				}}
				ref={rootTabRef}
			>
				<TabsList
					className="flex flex-col mb-5"
					onClick={(e) => {
						console.log(e.target);
					}}
				>
					<div className="flex">
						<TabsTrigger
							value="tasks"
							ref={(el) => {
								setRef(el, "tasks");
							}}
							onClick={(e) => {
								console.log(e.target);
							}}
							className={cn({ "hover:text-semi-primary": segment !== "tasks" })}
						>
							{t("task.plural")}
						</TabsTrigger>
						<TabsTrigger
							ref={(el) => {
								setRef(el, "timeEntries");
							}}
							className={cn({ "hover:text-semi-primary": segment !== "timeEntries" })}
							value="timeEntries"
						>
							{t("timeEntries.plural")}
						</TabsTrigger>
						<TabsTrigger
							ref={(el) => {
								setRef(el, "report");
							}}
							value="report"
							className={cn({ "hover:text-semi-primary": segment !== "report" })}
						>
							{t("report")}
						</TabsTrigger>
					</div>
					<Separator />
					<div
						className={cn("absolute bottom-[-2px] h-[3px] bg-primary rounded-b-xl", {
							"transition-all": isTransitionEnable.current,
						})}
						style={{
							left: leftPosition,
							width: width,
						}}
					></div>
				</TabsList>
			</Tabs> */
}
