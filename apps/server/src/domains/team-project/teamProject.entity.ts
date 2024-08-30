import { pgTable, primaryKey, timestamp, uuid } from "drizzle-orm/pg-core";
import { Team, teamTable } from "../team/team.entity";
import { Project, projectTable } from "../project/project.entity";
import { Rate, rateTable } from "../rate/rate.entity";
import { InferSelectModel, relations } from "drizzle-orm";

export const teamProjectTable = pgTable(
	"teamProject",
	{
		teamId: uuid("teamId")
			.notNull()
			.references(() => teamTable.id),
		projectId: uuid("projectId")
			.notNull()
			.references(() => projectTable.id),

		createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow(),
		updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow(),

		rateId: uuid("rateId").references(() => rateTable.id),
	},
	table => ({
		pk: primaryKey({ columns: [table.projectId, table.teamId] }),
	}),
);

export const teamProjectRelations = relations(teamProjectTable, ({ one }) => ({
	team: one(teamTable, {
		fields: [teamProjectTable.teamId],
		references: [teamTable.id],
	}),
	project: one(projectTable, {
		fields: [teamProjectTable.projectId],
		references: [projectTable.id],
	}),
	rate: one(rateTable, {
		fields: [teamProjectTable.rateId],
		references: [rateTable.id],
	}),
}));

export type TeamProject = InferSelectModel<typeof teamProjectTable> & {
	team: Team;
	project: Project;
	rate: Rate;
};
