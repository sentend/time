import { HTTPError } from "@/libs/httpError";
import { workspaceRepository, type Workspace } from "../workspace";
import {
	projectRepository,
	type IProjectRepository,
} from "./project.repository";
import { userRepository, type IUserRepository, type User } from "../user";
import {
	newProjectSchema,
	selectProjectSchema,
	type NewProjectDTO,
} from "./project.model";
import { db } from "@/db";
import {
	projectMemberRepository,
	type IProjectMemberRepository,
} from "../project-member";
import type { IWorkspaceRepository } from "../workspace";
import { NUMBER_OF_COLORS } from "@/config";
import { ProjectMapper } from "./helpers";
import type { NewProject } from "./project.model";
import type { ProjectDTO, ProjectLightDTO } from "./project.dto";

type CreateProjectParams = {
	currentWorkspace: Workspace;
	currentUser: User;
	body: NewProjectDTO;
};

export interface IProjectService {
	getAllProjectsInWorkspace(
		workspaceId: number,
		fiters: {},
	): Promise<ProjectLightDTO[]>;
	getProjectByIdInWorkspace(
		projectId: string,
		workspaceId: number,
	): Promise<ProjectDTO>;
	createProject(params: CreateProjectParams): Promise<ProjectDTO>;
	updateProjectById(
		projectId: string,
		workspaceId: number,
		values: Partial<ProjectDTO>,
	): Promise<ProjectDTO>;
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

		return projects.map(ProjectMapper.toLightDTO);
	}

	async getProjectByIdInWorkspace(projectId: string, workspaceId: number) {
		const project = await this.projectRepository.findProjectByIdInWorkspace(
			projectId,
			workspaceId,
		);

		if (!project) {
			throw new HTTPError(404, {
				message: "Not Found: Project not found",
			});
		}

		return ProjectMapper.toDTO(project);
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

		return ProjectMapper.toDTO(project);
	}

	async updateProjectById(
		projectId: string,
		workspaceId: number,
		values: Partial<ProjectDTO>,
	) {
		const data = selectProjectSchema.parse(values);

		console.log("data", data);
		const updatedProject = await this.projectRepository.updateProjectById(
			projectId,
			workspaceId,
			data,
		);

		if (!updatedProject) {
			throw new HTTPError(404, {
				message:
					"Not found: failed to update, probably project not exist",
			});
		}

		return ProjectMapper.toDTO(updatedProject);
	}
}

export const projectService = new ProjectService(
	projectRepository,
	projectMemberRepository,
	userRepository,
	workspaceRepository,
);
