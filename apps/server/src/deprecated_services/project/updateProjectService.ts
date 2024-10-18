import { type Project, type User, type Workspace } from "@/models";
import { NewProjectData, updateProject } from "@/models/project/methods";
import { TProject } from "~types/models";

//todo checks on zod schema
export default async (
	workspace: Workspace,
	projectId: string,
	body: Record<string, any>,
	currentUser: User,
) => {
	const {
		budgetEndDate,
		budgetType,
		colorId,
		isBillable,
		isBudgetSet,
		isNotedRequired,
		isTagsRequired,
		members,
		name,
		budgetInterval,
		budgetStartDate,
		budgetValue,
		client,
	} = body;

	const values: Omit<NewProjectData, "createdBy"> = {
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
		clientId: client.id,
		updatedBy: currentUser.id,
	};

	const project = await updateProject(workspace, projectId, values, currentUser);
	return project;
};
