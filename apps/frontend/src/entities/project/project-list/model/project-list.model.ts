import type { ProjectLightDTO } from "server/project";
import { getProjects } from "@/shared/api";
import { createEffect, createEvent, createStore, sample } from "effector";
import { $currentWorkspace } from "@/entities/workspace";

export const $projects = createStore<ProjectLightDTO[]>([]);

export const projectClick = createEvent<string>();

export const getProjectsFx = createEffect(async () => {
	const currentWorkspace = $currentWorkspace.getState();

	if (!currentWorkspace) {
		throw new Error("No current workspace");
	}

	const projects = await getProjects({ workspaceId: currentWorkspace.id, page: 1 });
	console.log(projects);

	return projects;
});

sample({
	clock: getProjectsFx.doneData,
	target: $projects,
});
