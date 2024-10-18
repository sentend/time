import { router } from "@/shared/router";
import { match } from "ts-pattern";
import { ProtectedRoutes } from "./protected-routes";
import { AuthLayout } from "./layout";

export const Router = () => {
	const route = router.useRoute(["protected", "auth"]);

	const view = match(route)
		.with({ name: "auth" }, () => <AuthLayout />)
		.otherwise(() => <ProtectedRoutes />);

	return view;
};
