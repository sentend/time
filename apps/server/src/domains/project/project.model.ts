import { z } from "zod";
import { NUMBER_OF_COLORS } from "@/config";
import { newProjectMemberSchema } from "../project-member";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { projectTable } from "./project.entity";

const selectProjectSchema = createSelectSchema(projectTable);

export const projectSchema = selectProjectSchema.pick({
	id: true,
	avatarFilename: true,
	budgetEndDate: true,
	budgetInterval: true,
	budgetStartDate: true,
	budgetType: true,
	budgetValue: true,
	colorId: true,
	clientId: true,
	createdAt: true,
	isArchived: true,
	isBillable: true,
	isBudgetSet: true,
	isNotedRequired: true,
	name: true,
	isTagsRequired: true,
});

export type ProjectDTO = z.infer<typeof projectSchema>;

const insertProjectSchema = createInsertSchema(projectTable, {
	colorId: t =>
		t.colorId
			.nonnegative("colorId should be positive")
			.min(0)
			.max(
				NUMBER_OF_COLORS,
				`colorId couldn"t be more than ${NUMBER_OF_COLORS}`,
			),
});

export const newProjectSchema = insertProjectSchema.extend({
	members: z.array(newProjectMemberSchema),
});

export type NewProjectModel = z.infer<typeof newProjectSchema>;
