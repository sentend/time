import {
	boolean,
	doublePrecision,
	integer,
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import { User, userTable } from "../user/user";
import { Rate, rateTable } from "../rate/rate";
import { Workspace, workspaceTable } from "../workspace/workspace";
import { InferSelectModel, relations } from "drizzle-orm";
import { Project, projectTable } from "../project/project";
import { Node, nodeTable } from "../node";
import { timeEntryTagTable } from "../timeEntry-tag/timeEntryTag";

export const timeEntryTable = pgTable("timeEntry", {
	id: uuid("id").primaryKey().defaultRandom(),

	beginDate: timestamp("beginDate", { withTimezone: false }).defaultNow(),
	endDate: timestamp("endDate", { withTimezone: false }),
	isAutotracked: boolean("isAutotracked").notNull().default(false),
	notes: text("notes"),
	confirmedDuration: integer("confirmedDuration"),
	confirmedRevenue: doublePrecision("confirmedRevenue"),
	rateValue: doublePrecision("confirmedRevenue"),
	isBillable: boolean("isBillable").notNull().default(false),
	createdAt: timestamp("createdAt", { withTimezone: false }).notNull().defaultNow(),
	updatedAt: timestamp("updatedAt", { withTimezone: false }).notNull().defaultNow(),

	userId: uuid("userId")
		.references(() => userTable.id)
		.notNull(),
	rateId: uuid("rateId").references(() => rateTable.id),
	workspaceId: integer("workspaceId")
		.references(() => workspaceTable.id)
		.notNull(),
	projectId: uuid("projectId")
		.references(() => projectTable.id)
		.notNull(),
	taskId: uuid("taskId")
		.references(() => nodeTable.id, { onDelete: "cascade" })
		.notNull(),
});

export const timeEntryRelations = relations(timeEntryTable, ({ many, one }) => ({
	user: one(userTable, {
		fields: [timeEntryTable.userId],
		references: [userTable.id],
	}),
	workspace: one(workspaceTable, {
		fields: [timeEntryTable.workspaceId],
		references: [workspaceTable.id],
	}),
	project: one(projectTable, {
		fields: [timeEntryTable.projectId],
		references: [projectTable.id],
	}),
	task: one(nodeTable, {
		fields: [timeEntryTable.taskId],
		references: [nodeTable.id],
	}),
	rate: one(rateTable, {
		fields: [timeEntryTable.rateId],
		references: [rateTable.id],
	}),
	tags: many(timeEntryTagTable),
}));

export type TimeEntry = InferSelectModel<typeof timeEntryTable> & {
	rate?: Rate;
	task?: Node;
	workspace?: Workspace;
	user?: User;
	project?: Project;
};
