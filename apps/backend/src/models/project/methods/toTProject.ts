import pick from "lodash/pick";

import { GetProjectService } from "~types/services";
import { Project } from "../project";
import { TCLient, TMember, TProject } from "~types/models";
import { Nullable } from "~types/supportTypes";

const toTProject = (project: Project): TProject => {
	const modifiedMembers = project.members!.map(member => {
		return {
			...pick(member!.user, ["id", "initials", "name"]),
			...pick(member, ["isManager"]),
			createdAt: member.createdAt?.getTime(),
			updatedAt: member.createdAt?.getTime(),
		} as TMember;
	});

	let client: Nullable<TCLient> = null;
	if (project.client) {
		client = pick(project.client, ["id", "name"]);
	}

	const result: Record<keyof TProject, any> = {
		...pick<typeof project, keyof TProject>(project, [
			"budgetEndDate",
			"budgetInterval",
			"budgetStartDate",
			"budgetType",
			"budgetValue",
			"colorId",
			"id",
			"isBillable",
			"isBudgetSet",
			"isNotedRequired",
			"isTagsRequired",
			"name",
		]),
		members: modifiedMembers,
		client,
	};

	return {
		...result,
		budgetEndDate: project.budgetEndDate?.getTime() ?? null,
		budgetStartDate: project.budgetStartDate?.getTime() ?? null,
	};
};

export default toTProject;
