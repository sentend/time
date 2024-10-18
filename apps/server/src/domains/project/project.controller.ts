import type { Context } from "hono";
import { projectService, type IProjectService } from "./project.service";
import { sendResult } from "@/libs/sendResult";
import type { ProjectDTO } from "./project.dto";

export class ProjectController {
	constructor(private projectService: IProjectService) {}

	async createProject(ctx: Context) {
		const { currentUser, currentWorkspace } = ctx.__internalState;
		const body = await ctx.req.json();

		const newProject = await this.projectService.createProject({
			body,
			currentUser,
			currentWorkspace,
		});

		return sendResult(ctx, newProject, { status: 201 });
	}

	async getAllProjectsInWorkspace(ctx: Context) {
		const { size, page } = ctx.req.query();

		const workspaceId = Number(ctx.req.param("workspaceId"));
		const projects = await this.projectService.getAllProjectsInWorkspace(
			workspaceId,
			{},
		);

		return sendResult(ctx, projects);
	}

	async getProject(ctx: Context) {
		const { req, res } = ctx;

		const workspaceId = Number(req.param("workspaceId"));
		const projectId = req.param("projectId");

		const project = await this.projectService.getProjectByIdInWorkspace(
			projectId,
			workspaceId,
		);

		return sendResult(ctx, project);
	}

	async updateProject(ctx: Context) {
		const { req, res } = ctx;

		const workspaceId = Number(req.param("workspaceId"));
		const projectId = req.param("projectId");
		const data = await req.json<Partial<ProjectDTO>>();

		const updatedProject = await this.projectService.updateProjectById(
			projectId,
			workspaceId,
			data,
		);

		return sendResult(ctx, updatedProject);
	}

	deleteProject(ctx: Context) {}
}

export const projectController = new ProjectController(projectService);
