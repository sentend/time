import type { NextFunction } from "express";
import { Request, Response } from "express";

export const prettyRequestLog = (req: Request, res: Response, next: NextFunction) => {
	console.log("\u001b[" + 32 + "m" + "---------------NEW REQUEST----------------" + "\u001b[0m");
	console.log("\u001b[" + 36 + "m" + `${req.method} url:: ${req.url}` + "\u001b[0m");
	next();
};
