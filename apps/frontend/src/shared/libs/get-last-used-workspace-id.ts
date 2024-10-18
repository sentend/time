import { storage } from "@/shared/storage";
import { lastUsedWorkspaceIdKey } from "@/shared/config";

export const getLastUsedWorkspaceId = async () => {
	const workspaceId = await storage.getItem<string>(lastUsedWorkspaceIdKey);

	return workspaceId;
};
