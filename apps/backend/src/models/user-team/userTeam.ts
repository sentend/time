import { boolean, integer, pgTable, primaryKey, timestamp, uuid } from "drizzle-orm/pg-core";
import { User, userTable } from "../user/user";
import { Team, teamTable } from "../team/team";
import { Workspace, workspaceTable } from "../workspace/workspace";
import { InferSelectModel, relations } from "drizzle-orm";

export const userTeamTable = pgTable(
    "userTeam",
    {
        userId: uuid("userId")
            .notNull()
            .references(() => userTable.id),
        teamId: uuid("teamId")
            .notNull()
            .references(() => teamTable.id),

        isTeamLead: boolean("isTeamLead").notNull().default(false),
        createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow(),
        updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow(),

        workspaceId: integer("workspaceId")
            .notNull()
            .references(() => workspaceTable.id)
    },
    table => ({
        pk: primaryKey(table.teamId, table.userId)
    })
);

export const userTeamRelations = relations(userTeamTable, ({ one }) => ({
    user: one(userTable, {
        fields: [userTeamTable.userId],
        references: [userTable.id]
    }),
    team: one(teamTable, {
        fields: [userTeamTable.teamId],
        references: [teamTable.id]
    }),
    workspace: one(workspaceTable, {
        fields: [userTeamTable.workspaceId],
        references: [workspaceTable.id]
    })
}));

export type UserTeam = InferSelectModel<typeof userTeamTable> & {
    team: Team;
    user: User;
    workspace: Workspace;
};
