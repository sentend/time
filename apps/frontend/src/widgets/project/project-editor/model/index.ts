import { createProjectFx } from "@/features/project/create-project";
import { createEvent, createStore } from "effector";

export const $isDialogOpen = createStore(false);
export const $buttonText = createStore("Create");
export const $titleText = createStore("Create new project");

export const toggleDialog = createEvent<boolean>();

$isDialogOpen.on(toggleDialog, (_, isOpen) => isOpen);
$isDialogOpen.on(createProjectFx.doneData, () => false);
