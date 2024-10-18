import { z } from "zod";
import { NUMBER_OF_COLORS } from "@/config";
import { newProjectMemberSchema } from "../project-member";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { projectTable } from "./project.entity";

export const selectProjectSchema = createSelectSchema(projectTable);

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

export type NewProjectDTO = z.infer<typeof newProjectSchema>;
export type NewProject = z.infer<typeof newProjectSchema>;
