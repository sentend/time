import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import ReactDOM from "react-dom/client";
import { HTML5Backend } from "react-dnd-html5-backend";

import { App } from "./App";

//initialize
import "../shared/i18n";
import { DndProvider } from "react-dnd";
import { isAppStartedAtom, store } from "@/shared/config";

addEventListener("DOMContentLoaded", () => {
	const queryClient = new QueryClient();

	store.set(isAppStartedAtom, true);

	ReactDOM.createRoot(document.getElementById("root")!).render(
		<DndProvider backend={HTML5Backend}>
			<QueryClientProvider client={queryClient}>
				<App />
				<ReactQueryDevtools initialIsOpen={false} />
			</QueryClientProvider>
		</DndProvider>
	);
});
