import { db, type DB } from "@/db";
import type { Workspace } from "../workspace";
import { userTable, type NewUser, type User } from "./user.entity";
import type { Maybe } from "~types/supportTypes";

export interface IUserRepository {
	getAllInWorkspace(workspaceId: Workspace["id"]): Promise<User[]>;
	getById(id: User["id"]): Promise<Maybe<User>>;
	getByEmail(email: User["email"]): Promise<Maybe<User>>;
	create(values: NewUser, db: DB): Promise<Maybe<User>>;
}

export class UserRepository implements IUserRepository {
	async getAllInWorkspace(workspaceId: Workspace["id"]) {
		const userIds = await db.query.userWorkspaceTable.findMany({
			columns: {
				userId: true,
			},
			where: (fields, { eq }) => eq(fields.workspaceId, workspaceId),
		});

		const users = await db.query.userTable.findMany({
			where(fields, { inArray }) {
				return inArray(
					fields.id,
					userIds.map(user => user.userId),
				);
			},
		});

		return users;
	}

	async getByEmail(email: User["email"]) {
		const user = await db.query.userTable.findFirst({
			where: (table, { eq }) => eq(table.email, email),
		});

		return user;
	}

	async getById(id: User["id"]) {
		const user = await db.query.userTable.findFirst({
			where: (table, { eq }) => eq(table.id, id),
		});

		return user;
	}

	async create(values: NewUser, _db = db) {
		const [user] = await _db.insert(userTable).values(values).returning();

		return user;
	}
}

export const userRepository = new UserRepository();
