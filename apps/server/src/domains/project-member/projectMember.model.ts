import { z } from "zod";

export const newProjectMemberSchema = z.object({
	userId: z.string(),
	isManager: z.boolean().optional(),
});

export type NewProjectMemberModel = z.infer<typeof newProjectMemberSchema>;
