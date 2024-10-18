import { createProject } from "@/entities/project/api/create-project";
import type { NewProjectDTO } from "server/project";
import { router } from "@/shared/router";
import { newProjectFormSchema, type NewProjectFormData, type ProjectMember } from "./schema";
import { createEffect, createEvent, createStore, sample } from "effector";
import { $currentUser } from "@/entities/user";
import { $currentWorkspace } from "@/entities/workspace";
import type { ColorOptions } from "@/shared/ui/color-palette";
import { DEFAULT_COLOR_ID } from "@/shared/config";
import type { ChangeEvent, FormEvent } from "react";

export const $name = createStore("");
export const $colorId = createStore(DEFAULT_COLOR_ID);
export const $members = createStore<ProjectMember[]>([]);
export const $formErrors = createStore({});

export const nameChanged = createEvent<ChangeEvent<HTMLInputElement>>();
export const colorIdChanged = createEvent<ColorOptions>();
export const submitForm = createEvent<FormEvent<HTMLFormElement>>();

submitForm.watch((event) => {
	console.log("q");
	event.preventDefault();
});

export const createProjectFx = createEffect(async (values: NewProjectFormData) => {
	const currentUser = $currentUser.getState();
	const currentWorkspace = $currentWorkspace.getState();

	if (!currentUser || !currentWorkspace) {
		router.replace("signin");
		return;
	}

	const data: NewProjectDTO = {
		...values,
		createdBy: currentUser.id,
		updatedBy: currentUser.id,
		workspaceId: currentWorkspace.id,
	};

	const result = await createProject({
		data,
		workspaceId: currentWorkspace.id,
	});

	return result;
});

createProjectFx.fail.watch(({ error }) => {
	console.error(error);
});

sample({
	source: $currentWorkspace,
	filter: Boolean,
	fn: (workspace) => workspace.nextProjectColorId,
	target: $colorId,
});

sample({
	clock: colorIdChanged,
	fn: ({ colorIndex }) => colorIndex,
	target: $colorId,
});

sample({
	clock: nameChanged,
	fn: (event) => event.target.value,
	target: $name,
});

sample({
	clock: submitForm,
	source: {
		name: $name,
		colorId: $colorId,
		members: $members,
	},
	filter: ({ name, colorId, members }) => {
		console.log("filter");
		const result = newProjectFormSchema.safeParse({
			name,
			colorId,
			members,
		});
		console.log(result);

		if (result.error) {
			result.error.issues.forEach((issue) => {
				issue.code;
			});
			return false;
		}

		return true;
	},
	target: createProjectFx,
});
