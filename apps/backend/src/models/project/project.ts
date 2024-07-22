import {
	boolean,
	doublePrecision,
	integer,
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import { Rate, rateTable } from "../rate/rate";
import { Workspace, workspaceTable } from "../workspace/workspace";
import { InferSelectModel, eq, relations } from "drizzle-orm";
import { Node, nodeTable } from "../node/node";
import { ProjectTag, projectTagTable } from "../project-tag/projectTag";
import { userTable } from "../user/user";
import { UserProject, userProjectTable } from "../user-project/userProject";
import { Client, clientTable } from "../client/client";

export const projectTable = pgTable("project", {
	id: uuid("id").primaryKey().defaultRandom(),
	name: text("name").notNull(),
	colorId: integer("colorId").notNull().default(0),
	createdAt: timestamp("createdAt", { withTimezone: false }).defaultNow().notNull(),
	updatedAt: timestamp("updatedAt", { withTimezone: false }).defaultNow().notNull(),
	isArchived: boolean("isArchived").notNull().default(false),
	isBillable: boolean("isBillable").notNull().default(false),
	isNotedRequired: boolean("isNotedRequired").notNull().default(false),
	isTagsRequired: boolean("isTagsRequired").notNull().default(false),
	currencyId: integer("currencyId"),
	isBudgetSet: boolean("isBudgetSet").notNull().default(false),
	budgetType: integer("budgetType"),
	budgetValue: doublePrecision("budgetValue"),
	budgetInterval: integer("budgetInterval"),
	budgetStartDate: timestamp("budgetStartDate", { withTimezone: false }),
	budgetEndDate: timestamp("budgetEndDate", { withTimezone: false }),
	avatarFilename: text("avatarFilename"),

	rateId: uuid("rateId").references(() => rateTable.id),
	workspaceId: integer("workspaceId")
		.notNull()
		.references(() => workspaceTable.id),
	createdBy: uuid("createdBy")
		.notNull()
		.references(() => userTable.id),
	updatedBy: uuid("updatedBy")
		.notNull()
		.references(() => userTable.id),
	clientId: uuid("clientId").references(() => clientTable.id, { onDelete: "set null" }),
});

export const projectRelations = relations(projectTable, ({ one, many }) => ({
	workspace: one(workspaceTable, {
		fields: [projectTable.workspaceId],
		references: [workspaceTable.id],
	}),
	rate: one(rateTable, {
		fields: [projectTable.id],
		references: [rateTable.id],
	}),
	createdBy: one(userTable, {
		fields: [projectTable.createdBy],
		references: [userTable.id],
	}),
	updatedBy: one(userTable, {
		fields: [projectTable.updatedBy],
		references: [userTable.id],
	}),
	client: one(clientTable, {
		fields: [projectTable.clientId],
		references: [clientTable.id],
	}),
	tasks: many(nodeTable),
	members: many(userProjectTable),
	tags: many(projectTagTable),
}));

export type Project = InferSelectModel<typeof projectTable> & {
	workspace?: Workspace;
	rate?: Rate;
	tasks?: Node[];
	projectTag?: ProjectTag[];
	members?: UserProject[];
	client?: Client | null;
};
