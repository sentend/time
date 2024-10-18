import { z } from "zod";

export const signinFormSchema = z.object({
	email: z.string().email(),
	password: z.string().min(1),
});

export type SigninFormSchema = z.infer<typeof signinFormSchema>;
