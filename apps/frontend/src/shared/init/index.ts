import { createEffect, sample } from "effector";
import { getLastUsedWorkspaceId, log } from "@/shared/libs";
import { getMe } from "@/shared/api";
import { appStarted } from "@/shared/config";
import { storage } from "@/shared/storage";
import { lastUsedWorkspaceIdKey } from "@/shared/config";

export const initUserDataFx = createEffect(async () => {
	const workspaceId = await getLastUsedWorkspaceId();

	const data = await getMe(workspaceId);

	const { user, workspaces, workspace } = data;

	return { user, workspaces, workspace };

	// store.set(workspaceMemberDataAtom, userWorkspaceData);
});

sample({
	clock: appStarted,
	target: initUserDataFx,
});

initUserDataFx.fail.watch(({ error }) => {
	throw new Error(error.message, error);
});

initUserDataFx.doneData.watch(async (result) => {
	log.success("app loaded");

	const { workspace } = result;

	storage.setItem(lastUsedWorkspaceIdKey, workspace.id);
});
