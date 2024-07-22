import { Router } from "express";
import { Request, Response } from "express";

import { Paging, Sorting, parseQSToBoolean, sendResult } from "@/utils";

import {
	type GetProjectsFilter,
	createProjectService,
	getProjectService,
	getProjectsService,
	updateProjectService,
	getProjectMembersSearchService,
	getProjectTimeEntriesService,
} from "@/services/project";

import "express-async-errors";

const router = Router();

router.get("/projects", async (req: Request, res: Response) => {
	const filter: GetProjectsFilter = {
		isArchived: parseQSToBoolean(req.query.isArchived),
		searchText: req.query.s as string,
	};
	const sorting = Sorting.fromQuery(req.query, "-createdAt");
	const paging = Paging.fromQuery(req.query);

	const projects = await getProjectsService(req.workspace!, filter, sorting, paging, req.user!);
	sendResult(res, projects);
});

router.get("/projects/:projectId", async (req: Request<{ projectId: string }>, res: Response) => {
	const { projectId } = req.params;
	const project = await getProjectService(req.workspace!, projectId, req.user!);
	sendResult(res, project);
});

router.post("/projects", async (req: Request, res: Response) => {
	const project = await createProjectService(req.workspace!, req.body, req.user!);
	sendResult(res, project);
});

router.put("/projects/:projectId", async (req: Request<{ projectId: string }>, res: Response) => {
	const { projectId } = req.params;
	const projects = await updateProjectService(req.workspace!, projectId, req.body, req.user!);
	sendResult(res, projects);
});

router.delete("/projects/:projectId", async (req: Request, res: Response) => {
	// const projects = await getProjectsService(req.workspace!, filter, sorting, paging, req.user!);
	// sendResult(res, projects);
});

router.get(
	"/projects/members/search",
	async (req: Request<{}, {}, {}, { search: string }>, res: Response) => {
		const { search } = req.query;
		const result = await getProjectMembersSearchService(req.workspace!, search, req.user!);
		sendResult(res, result);
	},
);

router.get(
	"/projects/:projectId/time-entries",
	async (req: Request<{ projectId: string }, {}, {}, { q: string }>, res: Response) => {
		const { projectId } = req.params;
		const result = await getProjectTimeEntriesService(
			req.workspace!,
			projectId,
			req.query,
			req.user!,
		);
		sendResult(res, result);
	},
);

export default router;
