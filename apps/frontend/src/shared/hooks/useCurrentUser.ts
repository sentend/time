import { useAppStore } from "../store";

export default () => {
	const { currentUser } = useAppStore();
	if (!currentUser) {
		throw new Error("NoCurrentUser");
	}
	return currentUser;
};
