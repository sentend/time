import { db } from "@/db";
import { HTTPError } from "@/libs/httpError";
import crypto from "crypto";
import { eq } from "drizzle-orm";
import { sessionTable } from "../session/session.entity";
import { UserMapper, IUserRepository, userRepository } from "../user";
import { workspaceMemberTable } from "../workspace-member";
import {
	WorkspaceMapper,
	workspaceRepository,
	type IWorkspaceRepository,
} from "../workspace";
import type { MeData, SigninData, SignupData } from "./auth.model";
import { SALT } from "@/config";

export class AuthService {
	constructor(
		private userRepository: IUserRepository,
		private workspaceRepository: IWorkspaceRepository,
	) {}

	async signin({ email, password }: SigninData) {
		if (!email || !password) {
			throw new HTTPError(404, {
				message: "EmailOrPasswordIsNotCorrect",
			});
		}

		const currentUser = await this.userRepository.getByEmail(email);

		if (!currentUser) {
			throw new HTTPError(404, {
				message: "EmailOrPasswordIsNotCorrect",
			});
		}

		const passwordHash = Buffer.from(currentUser.passwordHash, "base64");
		let inputPasswordHash: Buffer | undefined = undefined;
		try {
			inputPasswordHash = crypto.pbkdf2Sync(
				password,
				SALT,
				310000,
				32,
				"sha256",
			);
		} catch (err) {
			throw new HTTPError(400, {
				message: "EmailOrPasswordIsNotCorrect",
			});
		}
		if (!crypto.timingSafeEqual(inputPasswordHash, passwordHash)) {
			throw new HTTPError(400, {
				message: "EmailOrPasswordIsNotCorrect",
			});
		}

		const [newSession] = await db
			.insert(sessionTable)
			.values({ userId: currentUser.id })
			.returning();

		if (!newSession) {
			throw new HTTPError(500, { message: "CouldNotCreateNewSession" });
		}

		return { sessionId: newSession.id };
	}

	async signup({ name, email, password, initialWorkspaceName }: SignupData) {
		if (!email || !password || !name) {
			throw new HTTPError(400, { message: "NoInputData" });
		}

		const existingUser = await this.userRepository.getByEmail(email);

		if (existingUser) {
			throw new HTTPError(409, { message: "EmailAlreadyUsed" });
		}

		const workspaceName = initialWorkspaceName || name + "'s workspace";

		const initials = name
			.split(" ")
			.slice(0, 2)
			.map(item => item.charAt(0))
			.join("");

		let passwordHash: string = "";
		try {
			passwordHash = crypto
				.pbkdf2Sync(password, SALT, 310000, 32, "sha256")
				.toString("base64");
		} catch (err) {
			throw new HTTPError(409, {
				message: "InvalidPassword",
				cause: err,
			});
		}

		const txResult = await db.transaction(async tx => {
			const createUserQuery = this.userRepository.create(
				{ email, name, initials, passwordHash },
				tx,
			);

			const createWorkspaceQuery = this.workspaceRepository.create(
				{ name: workspaceName },
				tx,
			);

			const [user, workspace] = await Promise.all([
				createUserQuery,
				createWorkspaceQuery,
			]);

			if (!user || !workspace) {
				tx.rollback();
				return;
			}

			console.log(user);
			console.log(workspace);
			return { user, workspace };
		});

		if (!txResult?.user) {
			throw new HTTPError(500, { message: "CouldNotCreateNewUser" });
		}

		if (!txResult?.workspace) {
			throw new HTTPError(500, { message: "CouldNotCreateNewWorkspace" });
		}

		const { user, workspace } = txResult;

		await db
			.insert(workspaceMemberTable)
			.values({
				userId: user.id,
				workspaceId: workspace.id,
				isAdmin: true,
				isOwner: true,
				canCreateProjects: true,
				isActive: true,
			})
			.returning();

		const [newSession] = await db
			.insert(sessionTable)
			.values({ userId: user.id })
			.returning();

		if (!newSession) {
			throw new HTTPError(500, { message: "CouldNotCreateNewSession" });
		}

		return { sessionId: newSession.id };
	}

	async me({ currentUser, resolvedWorkspaceId }: MeData) {
		const userWorkspaces = await db.query.userWorkspaceTable.findMany({
			where: eq(workspaceMemberTable.userId, currentUser.id),
			with: {
				workspace: true,
			},
		});

		const workspaces = userWorkspaces.map(
			userWorkspace => userWorkspace.workspace,
		);

		if (workspaces.length === 0) {
			throw new HTTPError(400, { message: "UserHasNoWorkspaces" });
		}

		let currentWorkspace = workspaces[0];
		if (resolvedWorkspaceId) {
			const index = workspaces.findIndex(
				workspace => workspace.id === resolvedWorkspaceId,
			);

			if (~index) {
				currentWorkspace = workspaces[index];
			}
		}

		if (!currentWorkspace) {
			throw new HTTPError(404, { message: "UserHasNoWorkspaces" });
		}

		const userWorkspaceData = userWorkspaces.find(
			userWorkspace => userWorkspace.workspaceId === currentWorkspace.id,
		)!;

		return {
			user: UserMapper.toModel(currentUser),
			workspaces: workspaces.map(WorkspaceMapper.toModel),
			workspace: WorkspaceMapper.toModel(currentWorkspace),
			// userWorkspaceData: toIUserWorkspaceData(userWorkspaceData),
		};
	}
}

export const authService = new AuthService(userRepository, workspaceRepository);
