import { useUnit } from "effector-react";
import { Router } from "./router";
import { $isInitDataLoaded, $isInitialized } from "@/shared/store";

export const App = () => {
	const [isInitDataLoaded, isInitialized] = useUnit([$isInitDataLoaded, $isInitialized]);

	if (!isInitDataLoaded && !isInitialized) {
		return "Loading...";
	}

	return (
		<div className="text-base bg-main text-primary">
			<Router />
		</div>
	);
};
