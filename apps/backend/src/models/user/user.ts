import { InferSelectModel, relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { UserWorkspace, userWorkspaceTable } from "../user-workspace/userWorkspace";
import { TimeEntry, timeEntryTable } from "../timeEntry/timeEntry";
import { UserTeam, userTeamTable } from "../user-team/userTeam";
import { UserProject, userProjectTable } from "../user-project/userProject";
import { Session } from "../session/session";

export const userTable = pgTable("user", {
    id: uuid("id").primaryKey().defaultRandom(),
    passwordHash: text("passwordHash").notNull(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    initials: text("initials").notNull(),
    doiCreatedAt: timestamp("doiCreatedAt", { withTimezone: true }).defaultNow(),
    doiConfirmedAt: timestamp("doiConfirmedAt", { withTimezone: true }),
    createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updatedAt", { withTimezone: true }).notNull().defaultNow(),
    doiToken: text("doiToken"),
});

export const userRelations = relations(userTable, ({ many }) => ({
    workspaces: many(userWorkspaceTable),
    timeEntries: many(timeEntryTable),
    teams: many(userTeamTable),
    projects: many(userProjectTable),
}));

export type User = InferSelectModel<typeof userTable> & {
    projects?: UserProject[];
    teams?: UserTeam[];
    workspaces?: UserWorkspace[];
    timeEntries?: TimeEntry[];
    sessions?: Session[];
};
