import { InferSelectModel, relations } from "drizzle-orm";
import { integer, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { projectTable } from "../project/project.entity";

export const rateTable = pgTable("rate", {
	id: uuid("id").primaryKey().defaultRandom(),

	value: integer("value").notNull(),
	type: integer("type").notNull(),
	createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow(),
	updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow(),
});

export const rateRelations = relations(rateTable, ({ one, many }) => ({
	projects: many(projectTable),
}));

export type Rate = InferSelectModel<typeof rateTable>;
