import { Router } from "express";
import { Request, Response } from "express";
import "express-async-errors";
import { meService } from "@/services/auth";
import { parseQSToInt, sendResult } from "@/utils";

const router = Router();

// Me
router.get("/me", async (req: Request, res: Response) => {
	const workspaceId = parseQSToInt(req.query.workspaceId);
	const result = await meService(req.user!, workspaceId);

	sendResult(res, result);
});

export default router;
