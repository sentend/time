import { type Project, type User, type Workspace } from "@/models";
import { type NewProjectData, createProject } from "@/models/project/methods";

//todo checks on zod schema
export default async (workspace: Workspace, body: Record<string, any>, currentUser: User) => {
	if (body.name.length < 0) {
		throw new Error("NameIsEmpty");
	}

	const {
		budgetEndDate,
		budgetType,
		colorId,
		client,
		isBillable,
		isBudgetSet,
		isNotedRequired,
		isTagsRequired,
		members,
		name,
		budgetInterval,
		budgetStartDate,
		budgetValue,
	} = body;

	const values: NewProjectData = {
		workspaceId: workspace.id,
		budgetEndDate: budgetEndDate ? new Date(budgetEndDate) : null,
		budgetStartDate: budgetStartDate ? new Date(budgetStartDate) : null,
		budgetType,
		colorId,
		isBillable,
		isBudgetSet,
		isNotedRequired,
		isTagsRequired,
		members,
		name,
		budgetInterval,
		budgetValue,
		createdBy: currentUser.id,
		updatedBy: currentUser.id,
		clientId: client?.id,
	};

	const project = await createProject(workspace, values, currentUser);
	return project;
};
