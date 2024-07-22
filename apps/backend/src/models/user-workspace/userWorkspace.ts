import { InferSelectModel, relations } from "drizzle-orm";
import { boolean, integer, pgTable, primaryKey, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { Rate, rateTable } from "../rate/rate";
import { TimeEntry, timeEntryTable } from "../timeEntry/timeEntry";
import { User, userTable } from "../user/user";
import { Workspace, workspaceTable } from "../workspace/workspace";

export const userWorkspaceTable = pgTable(
	"userWorkspace",
	{
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
		createdAt: timestamp("createdAt", { withTimezone: false }).notNull().defaultNow(),
		updatedAt: timestamp("updatedAt", { withTimezone: false }).notNull().defaultNow(),

		rateId: uuid("rateId").references(() => rateTable.id),
		currentTimeEntryId: uuid("currentTimeEntryId").references(() => timeEntryTable.id),
	},
	table => ({
		pk: primaryKey(table.workspaceId, table.userId),
	}),
);

export const userWorkspaceRelations = relations(userWorkspaceTable, ({ one }) => ({
	user: one(userTable, {
		fields: [userWorkspaceTable.userId],
		references: [userTable.id],
	}),
	workspace: one(workspaceTable, {
		fields: [userWorkspaceTable.workspaceId],
		references: [workspaceTable.id],
	}),
	rate: one(rateTable, {
		fields: [userWorkspaceTable.rateId],
		references: [rateTable.id],
	}),
	currentTimeEntry: one(timeEntryTable, {
		fields: [userWorkspaceTable.currentTimeEntryId],
		references: [timeEntryTable.id],
	}),
}));

export type UserWorkspace = InferSelectModel<typeof userWorkspaceTable> & {
	user?: User;
	workspace?: Workspace;
	rate?: Rate;
	currentTimeEntry?: TimeEntry;
};
