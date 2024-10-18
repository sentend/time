import { z } from "zod";

const memberSchema = z.object({
	isManager: z.boolean(),
	userId: z.string(),
});

export type ProjectMember = z.infer<typeof memberSchema>;

export type NewProjectFormData = z.infer<typeof newProjectFormSchema>;

export const newProjectFormSchema = z.object({
	name: z
		.string()
		.min(1, { message: "error.nameRequired" })
		.refine((value) => value.trim(), { message: "error.invalidData" }),
	colorId: z.number(),
	members: z.array(memberSchema),
});
