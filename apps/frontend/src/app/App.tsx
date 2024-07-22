import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { RouterProvider } from "react-router";
import { createBrowserRouter } from "react-router-dom";

import { useAppStore } from "@/shared/store";

import { getPrivateRoutes, getPublicRoutes, getRoutes } from "./routes";

import "./styles/index.scss";
import { sid } from "@/shared/constants";
import { apiClient } from "@/shared/api";

export const App = () => {
	const { currentUser, currentWorkspace, initSession } = useAppStore();
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			const sessionId = Cookies.get(sid);
			if (sessionId) {
				await initSession(sessionId);
			}
			setIsLoading(false);
		};

		fetchData();
	}, [initSession]);

	if (isLoading) {
		return "Loading...";
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
