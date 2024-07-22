import {
	User,
	Workspace,
	clientTable,
	projectTable,
	userProjectTable,
	workspaceTable,
} from "@/models";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { GetProjectService } from "~types/services";
import { toTProject } from ".";
import { TCLient, TProject } from "~types/models";
import pick from "lodash/pick";

export type NewProjectData = {
	workspaceId: number;
	budgetEndDate: Date | null;
	budgetStartDate: Date | null;
	budgetType: number;
	colorId: number;
	isBillable: boolean;
	isBudgetSet: boolean;
	isNotedRequired: boolean;
	isTagsRequired: boolean;
	members?: GetProjectService.Member[];
	name: string;
	budgetInterval: number;
	budgetValue: number;
	createdBy: string;
	updatedBy: string;
	clientId: TCLient["id"];
};

export default async (
	workspace: Workspace,
	values: NewProjectData,
	currentUser: User,
): Promise<TProject> => {
	const { members, ...restValues } = values;

	const newProject = await db.transaction(async tx => {
		const [project] = await tx.insert(projectTable).values(restValues).returning();

		const projectMmebers =
			members?.map(user => ({
				isManager: user.isManager,
				projectId: project.id,
				userId: user.id,
			})) ?? [];

		const nextProjectColorId = (workspace.nextProjectColorId + 1) % 18;

		await Promise.allSettled([
			await tx.insert(userProjectTable).values(projectMmebers).execute(),

			await tx
				.update(workspaceTable)
				.set({ nextProjectColorId, updatedAt: new Date() })
				.where(eq(workspaceTable.id, workspace.id)),
		]);

		return project;
	});

	const project = await db.query.projectTable.findFirst({
		where: eq(projectTable.id, newProject.id),
		with: {
			members: {
				with: {
					user: true,
				},
			},
			client: true,
		},
	});

	return toTProject(project!);
};
