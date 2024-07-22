import { InferSelectModel, relations } from "drizzle-orm";
import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { projectTable } from "../project/project";
import { userWorkspaceTable } from "../user-workspace/userWorkspace";
import { clientTable } from "../client/client";

export const workspaceTable = pgTable("workspace", {
	id: serial("id").primaryKey(),

	name: text("name").notNull(),
	avatarFilename: text("avatarFilename"),
	nextProjectColorId: integer("nextProjectColorId").notNull().default(0),
	createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow(),
	updatedAt: timestamp("updatedAt", { withTimezone: true }).notNull().defaultNow(),
});

export const workspaceRelations = relations(workspaceTable, ({ many }) => ({
	projects: many(projectTable),
	userToWorkspace: many(userWorkspaceTable),
	clients: many(clientTable),
}));

export type Workspace = InferSelectModel<typeof workspaceTable>;
