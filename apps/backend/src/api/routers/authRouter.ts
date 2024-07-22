import { Router } from "express";
import { Request, Response } from "express";

import sendResult from "@/utils/sendResult";
import { SignupServiceInput } from "~types/services";
import { signinService, signupService } from "@/services/auth";

import "express-async-errors";

const router = Router();

// Signup
router.post("/signup", async (req: Request<{}, {}, SignupServiceInput>, res: Response) => {
	// TODO: wrap with parseQSToSting
	const input: SignupServiceInput = {
		email: req.body.email as string,
		password: req.body.password as string,
		name: req.body.name as string,
		workspaceName: req.body.workspaceName as string,
	};

	const result = await signupService(input);
	sendResult(res, result);
});

// Signin
router.post("/signin", async (req: Request, res: Response) => {
	const { email, password } = req.body;

	const result = await signinService({ email, password });
	sendResult(res, result);
});

export default router;
