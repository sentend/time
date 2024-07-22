import { useAppStore } from "../store";

export default () => {
    const { currentWorkspace } = useAppStore();
    if (!currentWorkspace) {
        throw new Error("NoCurrentWorkspace");
    }
    return currentWorkspace;
};
