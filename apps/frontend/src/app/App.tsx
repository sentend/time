import { RouterProvider } from "react-router";
import { createBrowserRouter } from "react-router-dom";
import { getPrivateRoutes, getPublicRoutes, getRoutes } from "./routes";
import "./styles/index.scss";
import { apiClient } from "@/shared/api";
import { useAtomValue } from "jotai";
import { currentUserAtom, currentWorkspaceAtom, isAppDataLoadingAtom } from "@/shared/config";

export const App = () => {
	const currentUser = useAtomValue(currentUserAtom);
	const currentWorkspace = useAtomValue(currentWorkspaceAtom);
	console.log("APP");
	console.log(currentUser, currentWorkspace);
	const isLoading = useAtomValue(isAppDataLoadingAtom);

	if (isLoading) {
		return "loading...";
	}

	let mainRoutes = getPublicRoutes();
	if (currentUser && currentWorkspace) {
		mainRoutes = getPrivateRoutes();
	}
	const effectiveRoutes = getRoutes(mainRoutes);
	const router = createBrowserRouter(effectiveRoutes);

	return <RouterProvider router={router} />;
};

import.meta.env.DEV ? (window.api = apiClient) : undefined;
