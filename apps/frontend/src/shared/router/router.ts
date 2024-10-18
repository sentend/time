import { createRouter } from "@swan-io/chicane";

export const router = createRouter({
	auth: "/auth/*",
	signin: "/auth/signin",
	signup: "/auth/signup",
	protected: "/:workspaceId/*",
	projects: "/:workspaceId/projects",
});
