import { useAtomValue } from "jotai";
import { currentUserAtom } from "../config";

export default () => {
	const currentUser = useAtomValue(currentUserAtom);
	if (!currentUser) {
		throw new Error("NoCurrentUser");
	}
	return currentUser;
};
