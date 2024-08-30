import {
	relations,
	type InferInsertModel,
	type InferSelectModel,
} from "drizzle-orm";
import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { projectTable } from "../project/project.entity";
import { workspaceMemberTable } from "../workspace-member/workspaceMember.entity";
import { clientTable } from "../client/client.entity";

export const workspaceTable = pgTable("workspace", {
	id: serial("id").primaryKey(),

	name: text("name").notNull(),
	avatarFilename: text("avatarFilename"),
	nextProjectColorId: integer("nextProjectColorId").notNull().default(0),
	projectsCount: integer("projectsCount").notNull().default(0),
	createdAt: timestamp("createdAt", { withTimezone: false })
		.notNull()
		.defaultNow(),
	updatedAt: timestamp("updatedAt", { withTimezone: false })
		.notNull()
		.defaultNow()
		.$onUpdateFn(() => new Date()),
});

export const workspaceRelations = relations(workspaceTable, ({ many }) => ({
	projects: many(projectTable),
	userToWorkspace: many(workspaceMemberTable),
	clients: many(clientTable),
}));

export type Workspace = InferSelectModel<typeof workspaceTable>;

export type NewWorkspace = InferInsertModel<typeof workspaceTable>;
