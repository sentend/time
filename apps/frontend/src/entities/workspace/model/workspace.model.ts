import type { WorkspaceDTO } from "server/workspace";
import { initUserDataFx } from "@/shared/init";
import { createStore } from "effector";

export const $currentWorkspace = createStore<WorkspaceDTO | null>(null);
export const $workspaces = createStore<WorkspaceDTO[]>([]);

$currentWorkspace.on(initUserDataFx.doneData, (_, data) => data.workspace);
$workspaces.on(initUserDataFx.doneData, (_, data) => data.workspaces);
