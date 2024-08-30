import type { User, UserModel } from "../user";
import type { Workspace } from "../workspace";

export type SigninData = {
	email: string;
	password: string;
};

export type SignupData = {
	email: string;
	password: string;
	name: string;
	initialWorkspaceName: string;
};

export type MeData = {
	currentUser: User;
	resolvedWorkspaceId: Workspace["id"];
};
