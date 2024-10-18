import { z } from "zod";

export const signupSchema = z
	.object({
		name: z.string().min(1),
		workspaceName: z.string().optional(),
		email: z.string().email().min(1),
		password: z.string().min(3),
		confirmPassword: z.string().min(3),
	})
	.refine(
		(data) => {
			return data.password === data.confirmPassword;
		},
		{
			message: "passwordsNotMatch",
			path: ["confirmPassword"],
		}
	);

export type SignupFormValues = z.infer<typeof signupSchema>;
