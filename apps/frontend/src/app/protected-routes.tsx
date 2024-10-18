import { $currentUser } from "@/entities/user";
import { $currentWorkspace } from "@/entities/workspace";
import { ProjectsPage } from "@/pages/projects-page";
import { router } from "@/shared/router";
import { useUnit } from "effector-react";
import { useLayoutEffect } from "react";
import { match } from "ts-pattern";
import { MainLayout } from "./layout";

export const ProtectedRoutes = () => {
	const route = router.useRoute(["projects", "protected"]);
	console.log(route);

	const [currentUser, currentWorkspace] = useUnit([$currentUser, $currentWorkspace]);

	useLayoutEffect(() => {
		console.log("protected route work");
		if (!currentUser && !currentWorkspace) {
			router.replace("signin");
		}
	});

	const view = match(route)
		.with({ name: "projects" }, () => <ProjectsPage />)
		.otherwise(() => {
			return <div>404 page</div>;
		});

	return <MainLayout>{view}</MainLayout>;
};
