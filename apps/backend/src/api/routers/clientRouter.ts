import { Router } from "express";
import { Request, Response } from "express";

import { Paging, Sorting, sendResult } from "@/utils";

import { getProjectsService } from "@/services/project";

import "express-async-errors";
import { getClientsService } from "@/services/client";

const clientRouter = Router();

clientRouter.get("/clients", async (req: Request, res: Response) => {
	const filter = {
		searchText: req.query.searchText as string,
	};

	const projects = await getClientsService(req.workspace!, filter, req.user!);
	sendResult(res, projects);
});

export default clientRouter;
