import {
	InferSelectModel,
	relations,
	type InferInsertModel,
} from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import {
	WorkspaceMember,
	workspaceMemberTable,
} from "../workspace-member/workspaceMember.entity";
import { TimeEntry, timeEntryTable } from "../timeEntry/timeEntry.entity";
import { TeamMember, teamMemberTable } from "../team-member/teamMember.entity";
import {
	ProjectMember,
	projectMemberTable,
} from "../project-member/projectMember.entity";
import { Session } from "../session/session.entity";

export const userTable = pgTable("user", {
	id: uuid("id").primaryKey().defaultRandom(),

	passwordHash: text("passwordHash").notNull(),
	name: text("name").notNull(),
	email: text("email").notNull(),
	initials: text("initials").notNull(),
	doiCreatedAt: timestamp("doiCreatedAt", {
		withTimezone: false,
	}).defaultNow(),
	doiConfirmedAt: timestamp("doiConfirmedAt", { withTimezone: false }),
	createdAt: timestamp("createdAt", { withTimezone: false })
		.notNull()
		.defaultNow(),
	updatedAt: timestamp("updatedAt", { withTimezone: false })
		.notNull()
		.defaultNow(),
	doiToken: text("doiToken"),
});

export const userRelations = relations(userTable, ({ many }) => ({
	workspaces: many(workspaceMemberTable),
	timeEntries: many(timeEntryTable),
	teams: many(teamMemberTable),
	projects: many(projectMemberTable),
}));

export type User = InferSelectModel<typeof userTable> & {
	projects?: ProjectMember[];
	teams?: TeamMember[];
	workspaces?: WorkspaceMember[];
	timeEntries?: TimeEntry[];
	sessions?: Session[];
};

export type NewUser = InferInsertModel<typeof userTable>;
