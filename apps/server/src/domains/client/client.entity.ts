import {
	integer,
	pgTable,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import { relations, type InferSelectModel } from "drizzle-orm";
import { workspaceTable } from "../workspace";
import { projectTable } from "../project/project.entity";

export const clientTable = pgTable("client", {
	id: uuid("id").primaryKey().defaultRandom(),

	name: varchar("name", { length: 256 }).notNull(),
	createdAt: timestamp("createdAt", { withTimezone: false })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp("updatedAt", { withTimezone: false })
		.defaultNow()
		.notNull(),

	workspaceId: integer("workspaceId")
		.references(() => workspaceTable.id, { onDelete: "cascade" })
		.notNull(),
});

export const clientRelations = relations(clientTable, ({ one, many }) => ({
	workspace: one(workspaceTable, {
		fields: [clientTable.workspaceId],
		references: [workspaceTable.id],
	}),
	project: many(projectTable),
}));

export type Client = InferSelectModel<typeof clientTable>;
