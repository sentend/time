import { Router } from "express";
import { Request, Response } from "express";

import { sendResult } from "@/utils";
import createTaskService from "@/services/node/createTaskService";
import {
	createFolderService,
	deleteNodeService,
	getProjectNodesService,
	markNodeAsCompletedService,
	moveNodeService,
} from "@/services/node";

import "express-async-errors";

const router = Router();

router.get(
	"/projects/:projectId/nodes",
	async (req: Request<{ projectId: string }, {}, {}, { q: string }>, res: Response) => {
		const { projectId } = req.params;
		const result = await getProjectNodesService(
			req.workspace!,
			projectId,
			req.query,
			req.user!,
		);
		sendResult(res, result);
	},
);

router.post("/nodes", async (req: Request<{}, {}, { parentId: string | null }>, res: Response) => {
	const newNode = await createFolderService(req.workspace!, req.body, req.user!);
	sendResult(res, newNode);
});

router.post("/tasks", async (req: Request<{}, {}, { parentId: string | null }>, res: Response) => {
	const newNode = await createTaskService(req.workspace!, req.body, req.user!);
	sendResult(res, newNode);
});

router.post(
	"/folders",
	async (req: Request<{}, {}, { parentId: string | null }>, res: Response) => {
		const newNode = await createFolderService(req.workspace!, req.body, req.user!);
		sendResult(res, newNode);
	},
);

router.put(
	"/nodes/:nodeId/move",
	async (
		req: Request<{ nodeId: string }, {}, { order?: number; parentId?: string | null }>,
		res: Response,
	) => {
		const { order, parentId } = req.body;
		const { nodeId } = req.params;

		const updatedNode = await moveNodeService(
			req.workspace!,
			nodeId,
			{ order: String(order), parentId },
			req.user!,
		);
		sendResult(res, updatedNode);
	},
);

router.put(
	"/nodes/:nodeId/complete",
	async (
		req: Request<{ nodeId: string }, {}, { order?: number; parentId?: string | null }>,
		res: Response,
	) => {
		const { nodeId } = req.params;

		const updatedNode = await markNodeAsCompletedService(req.workspace!, nodeId, req.user!);
		sendResult(res, updatedNode);
	},
);

router.delete("/nodes/:nodeId", async (req: Request<{ nodeId: string }>, res: Response) => {
	const { nodeId } = req.params;
	const newNode = await deleteNodeService(req.workspace!, nodeId, req.user!);
	sendResult(res, newNode);
});

export default router;
