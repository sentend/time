export type WorkspaceMemberModel = {
	workspaceId: number;
	userId: string;
	isOwner: boolean;
	isAdmin: boolean;
	canCreateProjects: boolean;
	isActive: boolean;
	firstDayOfWeek: number;
	currentTaskId: string | null;
	currentTimeEntryId: string | null;
};
