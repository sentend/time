import { useAtomValue } from "jotai";
import { useAppStore } from "../store";
import { currentWorkspaceAtom } from "../config";

export default () => {
	const currentWorkspace = useAtomValue(currentWorkspaceAtom);
	if (!currentWorkspace) {
		throw new Error("NoCurrentWorkspace");
	}
	return currentWorkspace;
};
