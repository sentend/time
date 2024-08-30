import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { databaseCredentials } from "@/config";
import { nodeTable } from "@/domains/node";
import { workspaceTable } from "@/domains/workspace";
import { clientTable } from "@/domains/client";
import {
	workspaceMemberRelations,
	workspaceMemberTable,
} from "@/domains/workspace-member";
import { userRelations, userTable } from "@/domains/user";
import { projectRelations, projectTable } from "@/domains/project";
import { sessionRelations, sessionTable } from "@/domains/session";
import {
	userProjectRelations,
	projectMemberTable,
} from "@/domains/project-member";

export const client = new Pool(databaseCredentials);

export type DB = typeof db;

export const schema = {
	nodeTable,
	workspaceTable,
	clientTable,
	userWorkspaceTable: workspaceMemberTable,
	userTable,
	projectTable,
	projectRelations,
	userWorkspaceRelations: workspaceMemberRelations,
	sessionRelations,
	sessionTable,
	userRelations,
	userProjectTable: projectMemberTable,
	userProjectRelations,
} as const;

export const db = drizzle(client, {
	schema,
});
