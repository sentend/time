import { InferSelectModel, relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { TeamMember, teamMemberTable } from "../team-member/teamMember.entity";

export const teamTable = pgTable("team", {
	id: uuid("id").primaryKey().defaultRandom(),

	name: text("name").notNull(),
	createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow(),
	updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow(),
});

export const teamRelations = relations(teamTable, ({ one, many }) => ({
	users: many(teamMemberTable),
}));

export type Team = InferSelectModel<typeof teamTable> & {
	users: TeamMember[];
};
