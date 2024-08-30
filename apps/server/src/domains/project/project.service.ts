import { HTTPError } from "@/libs/httpError";
import { workspaceRepository, type Workspace } from "../workspace";
import type { Project } from "./project.entity";
import {
	projectRepository,
	type IProjectRepository,
} from "./project.repository";
import { userRepository, type IUserRepository, type User } from "../user";
import {
	newProjectSchema,
	type NewProjectModel,
	type ProjectDTO,
} from "./project.model";
import { db } from "@/db";
import {
	projectMemberRepository,
	type IProjectMemberRepository,
} from "../project-member";
import type { IWorkspaceRepository } from "../workspace";
import { NUMBER_OF_COLORS } from "@/config";
import { ProjectMapper } from "./helpers";

type CreateProjectParams = {
	currentWorkspace: Workspace;
	currentUser: User;
	body: NewProjectModel;
};

export interface IProjectService {
	getAllProjectsInWorkspace(
		workspaceId: number,
		fiters: {},
	): Promise<Project[]>;

	createProject(params: CreateProjectParams): Promise<ProjectDTO>;
}

export class ProjectService implements IProjectService {
	constructor(
		private projectRepository: IProjectRepository,
		private projectMemberRepository: IProjectMemberRepository,
		private userRepository: IUserRepository,
		private workspaceRepository: IWorkspaceRepository,
	) {}

	async getAllProjectsInWorkspace(workspaceId: number, fiters: {}) {
		const projects =
			await this.projectRepository.findAllProjectsInWorkspace(
				workspaceId,
			);

		return projects;
	}

	async createProject(params: CreateProjectParams) {
		const { body, currentWorkspace } = params;

		const resultProjectValues = newProjectSchema.safeParse(body);

		if (resultProjectValues.error) {
			throw new HTTPError(400, {
				message: "Data incorrect",
				cause: resultProjectValues.error.cause,
			});
		}

		const { members, ...projectValues } = resultProjectValues.data;

		const existingUser = await this.userRepository.getById(
			projectValues.createdBy,
		);

		//todo добавить проверку на права юзера в воркспейсе

		if (!existingUser) {
			throw new HTTPError(403, {
				message:
					"User either not exist or have no rights to create new project in workspace",
			});
		}

		const project = await db.transaction(async tx => {
			const newProject = await this.projectRepository.createProject(
				projectValues,
				tx,
			);

			if (!newProject) {
				tx.rollback();
				throw new HTTPError(500, {
					message: "UnexpectedError: Failed to create new project",
				});
			}

			const nextProjectColorId =
				(currentWorkspace.nextProjectColorId + 1) % NUMBER_OF_COLORS;

			const updateWorkspaceColorPromise =
				this.workspaceRepository.updateWorkspaceById(
					projectValues.workspaceId,
					{ nextProjectColorId },
				);

			const createProjectMemberPromises = members.map(pMember =>
				this.projectMemberRepository.createProjectMember(
					{
						projectId: newProject.id,
						...pMember,
					},
					tx,
				),
			);

			const result = await Promise.all([
				...createProjectMemberPromises,
				updateWorkspaceColorPromise,
			]);

			if (result.includes(undefined)) {
				tx.rollback();
				throw new HTTPError(500, {
					message:
						"UnexpectedError: Failed to create project members or update workspace color",
				});
			}

			return newProject;
		});

		return ProjectMapper.toModel(project);
	}
}

export const projectService = new ProjectService(
	projectRepository,
	projectMemberRepository,
	userRepository,
	workspaceRepository,
);
