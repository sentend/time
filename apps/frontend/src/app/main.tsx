import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import ReactDOM from "react-dom/client";
import { HTML5Backend } from "react-dnd-html5-backend";
import { App } from "./app";
import { DndProvider } from "react-dnd";
import { apiClient, queryClient } from "@/shared/api";

import "@/shared/i18n";
import "./styles/index.scss";
import { appStarted } from "@/shared/config";

addEventListener("DOMContentLoaded", () => {
	appStarted();

	ReactDOM.createRoot(document.getElementById("root")!).render(
		<DndProvider backend={HTML5Backend}>
			<QueryClientProvider client={queryClient}>
				<App />
				<ReactQueryDevtools initialIsOpen={false} />
			</QueryClientProvider>
		</DndProvider>
	);
});

import.meta.env.DEV ? (window.api = apiClient) : undefined;

if (import.meta.hot) {
	import.meta.hot.on("vite:beforeUpdate", () => console.clear());
}
