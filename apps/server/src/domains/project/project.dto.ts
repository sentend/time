import type { z } from "zod";
import { selectProjectSchema } from "./project.model";

export const projectSchemaLight = selectProjectSchema.pick({
	id: true,
	name: true,
	colorId: true,
});

export type ProjectLightDTO = z.infer<typeof projectSchemaLight>;

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
