import { db, type DB } from "@/db";
import {
	projectMemberTable,
	type NewProjectMember,
	type ProjectMember,
} from "./projectMember.entity";
import { HTTPError } from "@/libs/httpError";

export interface IProjectMemberRepository {
	createProjectMember(
		values: NewProjectMember,
		_db?: DB,
	): Promise<ProjectMember | undefined>;
}

export class ProjectMemberRepository implements IProjectMemberRepository {
	async createProjectMember(values: NewProjectMember, _db = db) {
		const [projectMember] = await _db
			.insert(projectMemberTable)
			.values(values)
			.returning();

		return projectMember;
	}
}

export const projectMemberRepository = new ProjectMemberRepository();
