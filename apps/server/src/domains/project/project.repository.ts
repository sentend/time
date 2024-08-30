import { db, type DB } from "@/db";
import { projectTable, type Project, type NewProject } from "./project.entity";
import { eq } from "drizzle-orm";
import type { Maybe } from "~types/supportTypes";

export interface IProjectRepository {
	createProject(values: NewProject, _db?: DB): Promise<Project | undefined>;
	updateProject(
		id: Project["id"],
		values: Partial<Project>,
	): Promise<Maybe<Project>>;
	getProjectById(id: Project["id"]): Promise<Maybe<Project>>;
	findAllProjectsInWorkspace(workspaceId: number): Promise<Project[]>;
	deleteProject(id: Project["id"]): void;
}

export class ProjectRepository implements IProjectRepository {
	async createProject(values: NewProject, _db = db) {
		const [project] = await _db
			.insert(projectTable)
			.values(values)
			.returning();

		return project;
	}

	async findAllProjectsInWorkspace(workspaceId: number) {
		const projects = await db.query.projectTable.findMany({
			where: (t, { eq }) => eq(t.workspaceId, workspaceId),
		});

		return projects;
	}

	async deleteProject(id: Project["id"]) {
		const [project] = await db
			.delete(projectTable)
			.where(eq(projectTable.id, id))
			.returning();

		if (!project) {
			throw new Error("couldn't create new project");
		}
	}

	async getProjectById(id: Project["id"]) {
		const project = await db.query.projectTable.findFirst({
			where: (fields, { eq }) => eq(fields.id, id),
		});

		return project;
	}

	async updateProject(id: string, values: Partial<Project>) {
		const [updatedProject] = await db
			.update(projectTable)
			.set(values)
			.where(eq(projectTable.id, id))
			.returning();

		return updatedProject;
	}
}

export const projectRepository = new ProjectRepository();
