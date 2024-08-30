import type {
	InferInsertModel,
	InferSelectModel,
	Relations,
} from "drizzle-orm";
import { relations } from "drizzle-orm";
import {
	boolean,
	integer,
	pgTable,
	primaryKey,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import { type Rate, rateTable } from "../rate/rate.entity";
import { type TimeEntry, timeEntryTable } from "../timeEntry/timeEntry.entity";
import { type User, userTable } from "../user";
import { type Workspace, workspaceTable } from "../workspace";

export const workspaceMemberTable = pgTable("workspaceMember", {
	id: uuid("id").primaryKey().defaultRandom(),
	workspaceId: integer("workspaceId")
		.notNull()
		.references(() => workspaceTable.id),
	userId: uuid("userId")
		.notNull()
		.references(() => userTable.id),

	isOwner: boolean("isOwner").notNull().default(false),
	isAdmin: boolean("isAdmin").notNull().default(false),
	canCreateProjects: boolean("canCreateProjects").notNull().default(true),
	isActive: boolean("isActive").notNull().default(true),
	currentTaskId: text("currentTaskId"),
	inviteToken: text("inviteToken"),
	inviteValidUntil: timestamp("inviteValidUntil", { withTimezone: true }),
	firstDayOfWeek: integer("firstDayOfWeek").notNull().default(0),
	createdAt: timestamp("createdAt", { withTimezone: false })
		.notNull()
		.defaultNow(),
	updatedAt: timestamp("updatedAt", { withTimezone: false })
		.notNull()
		.$onUpdate(() => new Date()),

	rateId: uuid("rateId").references(() => rateTable.id),
	currentTimeEntryId: uuid("currentTimeEntryId").references(
		() => timeEntryTable.id,
	),
});

export const workspaceMemberRelations = relations(
	workspaceMemberTable,
	({ one }) => ({
		user: one(userTable, {
			fields: [workspaceMemberTable.userId],
			references: [userTable.id],
		}),
		workspace: one(workspaceTable, {
			fields: [workspaceMemberTable.workspaceId],
			references: [workspaceTable.id],
		}),
		rate: one(rateTable, {
			fields: [workspaceMemberTable.rateId],
			references: [rateTable.id],
		}),
		currentTimeEntry: one(timeEntryTable, {
			fields: [workspaceMemberTable.currentTimeEntryId],
			references: [timeEntryTable.id],
		}),
	}),
);

export type WorkspaceMember = InferSelectModel<typeof workspaceMemberTable> & {
	user?: User;
	workspace?: Workspace;
	rate?: Rate;
	currentTimeEntry?: TimeEntry;
};

export type NewWorkspaceMember = InferInsertModel<typeof workspaceMemberTable>;
