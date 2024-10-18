import { SigninPage } from "@/pages/signin-page";
import { SignupPage } from "@/pages/signup-page";
import { router } from "@/shared/router/router";
import { match } from "ts-pattern";

export const AuthLayout = () => {
	const route = router.useRoute(["signin", "signup"]);

	const view = match(route)
		.with({ name: "signin" }, () => <SigninPage />)
		.with({ name: "signup" }, () => <SignupPage />)
		.otherwise(() => {
			return <div>404 error</div>;
		});

	return <div className="p-4">{view}</div>;
};
