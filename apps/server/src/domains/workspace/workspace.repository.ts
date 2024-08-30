import { db, type DB } from "@/db";
import { WorkspaceMapper } from "./helpers/workspace.mapper";
import {
	workspaceTable,
	type NewWorkspace,
	type Workspace,
} from "./workspace.entity";
import type { WorkspaceModel } from "./workspace.model";
import { eq } from "drizzle-orm";
import type { Maybe } from "~types/supportTypes";

export interface IWorkspaceRepository {
	create(values: NewWorkspace, _db: DB): Promise<Maybe<WorkspaceModel>>;
	findById(id: Workspace["id"]): Promise<Maybe<Workspace>>;
	updateWorkspaceById(
		id: Workspace["id"],
		values: Partial<Workspace>,
	): Promise<Maybe<WorkspaceModel>>;
}

export class WorkspaceRepository implements IWorkspaceRepository {
	async create(values: Workspace, _db = db) {
		const [workspace] = await _db
			.insert(workspaceTable)
			.values(values)
			.returning();

		return workspace;
	}
	async findById(id: Workspace["id"]) {
		const workspace = await db.query.workspaceTable.findFirst({
			where: eq(workspaceTable.id, id),
		});

		return workspace;
	}

	async updateWorkspaceById(id: Workspace["id"], values: Partial<Workspace>) {
		const [updatedWorkspace] = await db
			.update(workspaceTable)
			.set(values)
			.where(eq(workspaceTable.id, id))
			.returning();

		return updatedWorkspace;
	}
}

export const workspaceRepository = new WorkspaceRepository();
