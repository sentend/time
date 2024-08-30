import type { User } from "@/domains/user";
import type { Workspace } from "@/domains/workspace";

declare module "hono" {
	export interface Context {
		__internalState: {
			currentUser: User;
			currentWorkspace: Workspace;
		};
	}
}
