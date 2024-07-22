import { boolean, pgTable, primaryKey, timestamp, uuid } from "drizzle-orm/pg-core";
import { Project, projectTable } from "../project/project";
import { User, userTable } from "../user/user";
import { Rate, rateTable } from "../rate/rate";
import { InferSelectModel, relations } from "drizzle-orm";

export const userProjectTable = pgTable(
	"userProject",
	{
		projectId: uuid("projectId")
			.notNull()
			.references(() => projectTable.id, { onDelete: "cascade" }),
		userId: uuid("userId")
			.notNull()
			.references(() => userTable.id, { onDelete: "cascade" }),

		isManager: boolean("isManager").notNull().default(false),
		createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow(),
		updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow(),

		rateId: uuid("rateId").references(() => rateTable.id),
	},
	table => ({
		pk: primaryKey(table.projectId, table.userId),
	}),
);

export const userProjectRelations = relations(userProjectTable, ({ one }) => ({
	user: one(userTable, {
		fields: [userProjectTable.userId],
		references: [userTable.id],
	}),
	project: one(projectTable, {
		fields: [userProjectTable.projectId],
		references: [projectTable.id],
	}),
	rate: one(rateTable, {
		fields: [userProjectTable.rateId],
		references: [rateTable.id],
	}),
}));

export type UserProject = InferSelectModel<typeof userProjectTable> & {
	project?: Project;
	user?: User;
	rate?: Rate;
};
