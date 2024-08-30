import type { Context } from "hono";
import { projectService, type ProjectService } from "./project.service";
import { sendResult } from "@/libs/sendResult";

export class ProjectController {
	constructor(private projectService: ProjectService) {}

	async createProject(ctx: Context) {
		const { currentUser, currentWorkspace } = ctx.__internalState;
		const body = await ctx.req.json();

		console.log("create project body", body);

		const newProject = await this.projectService.createProject({
			body,
			currentUser,
			currentWorkspace,
		});

		return sendResult(ctx, newProject, { status: 201 });
	}

	async getAllProjectsInWorkspace(ctx: Context) {
		console.log(ctx.req.query());
		const {} = ctx.req.query();
		const workspaceId = Number(ctx.req.param("workspaceId"));
		const projects = await this.projectService.getAllProjectsInWorkspace(
			workspaceId,
			{},
		);

		return sendResult(ctx, projects);
	}

	async getProject(ctx: Context) {
		const { req, res } = ctx;
	}

	updateProject(ctx: Context) {}

	deleteProject(ctx: Context) {}
}

export const projectController = new ProjectController(projectService);
