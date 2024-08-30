import {
	boolean,
	integer,
	pgTable,
	primaryKey,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import { User, userTable } from "../user/user.entity";
import { Team, teamTable } from "../team/team.entity";
import { Workspace, workspaceTable } from "../workspace/workspace.entity";
import {
	InferSelectModel,
	relations,
	type InferInsertModel,
} from "drizzle-orm";

export const teamMemberTable = pgTable("teamMember", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: uuid("userId")
		.notNull()
		.references(() => userTable.id),
	teamId: uuid("teamId")
		.notNull()
		.references(() => teamTable.id),

	isTeamLead: boolean("isTeamLead").notNull().default(false),
	createdAt: timestamp("createdAt", { withTimezone: false }).defaultNow(),
	updatedAt: timestamp("updatedAt", { withTimezone: false }).$onUpdate(
		() => new Date(),
	),

	workspaceId: integer("workspaceId")
		.notNull()
		.references(() => workspaceTable.id),
});

export const teamMemberRelations = relations(teamMemberTable, ({ one }) => ({
	user: one(userTable, {
		fields: [teamMemberTable.userId],
		references: [userTable.id],
	}),
	team: one(teamTable, {
		fields: [teamMemberTable.teamId],
		references: [teamTable.id],
	}),
	workspace: one(workspaceTable, {
		fields: [teamMemberTable.workspaceId],
		references: [workspaceTable.id],
	}),
}));

export type TeamMember = InferSelectModel<typeof teamMemberTable> & {
	team: Team;
	user: User;
	workspace: Workspace;
};

export type NewTeamMember = InferInsertModel<typeof teamMemberTable>;
