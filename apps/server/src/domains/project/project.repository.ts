import { db, type DB } from "@/db";
import {
	projectTable,
	type ProjectEntity,
	type NewProjectEntity,
} from "./project.entity";
import { and, eq } from "drizzle-orm";
import type { Maybe } from "~types/supportTypes";

export interface IProjectRepository {
	createProject(
		values: NewProjectEntity,
		_db?: DB,
	): Promise<ProjectEntity | undefined>;
	updateProjectById(
		id: ProjectEntity["id"],
		workspaceId: number,
		values: Partial<ProjectEntity>,
	): Promise<ProjectEntity | undefined>;
	findProjectByIdInWorkspace(
		id: ProjectEntity["id"],
		workspaceId: number,
	): Promise<Maybe<ProjectEntity>>;
	findAllProjectsInWorkspace(workspaceId: number): Promise<ProjectEntity[]>;
	deleteProject(id: ProjectEntity["id"]): void;
}

export class ProjectRepository implements IProjectRepository {
	async createProject(values: NewProjectEntity, _db = db) {
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

	async deleteProject(id: ProjectEntity["id"]) {
		const [project] = await db
			.delete(projectTable)
			.where(eq(projectTable.id, id))
			.returning();

		if (!project) {
			throw new Error("couldn't create new project");
		}
	}

	async findProjectByIdInWorkspace(
		id: ProjectEntity["id"],
		workspaceId: number,
	) {
		const project = await db.query.projectTable.findFirst({
			where: (fields, { eq, and }) =>
				and(eq(fields.id, id), eq(fields.workspaceId, workspaceId)),
		});

		return project;
	}

	async updateProjectById(
		id: string,
		workspaceId: number,
		values: Partial<ProjectEntity>,
	) {
		const [updatedProject] = await db
			.update(projectTable)
			.set(values)
			.where(
				and(
					eq(projectTable.id, id),
					eq(projectTable.workspaceId, workspaceId),
				),
			)
			.returning();

		return updatedProject;
	}
}

export const projectRepository = new ProjectRepository();
