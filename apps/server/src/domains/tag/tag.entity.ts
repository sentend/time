import { InferSelectModel, relations } from "drizzle-orm";
import {
	boolean,
	integer,
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import { ProjectTag, projectTagTable } from "../project-tag/projectTag.entity";
import {
	TimeEntryTag,
	timeEntryTagTable,
} from "../timeEntry-tag/timeEntryTag.entity";

export const tagTable = pgTable("tag", {
	id: uuid("id").primaryKey().defaultRandom(),

	name: text("name").notNull(),
	colorId: integer("colorId").notNull().default(0),
	isDeleted: boolean("isDeleted").notNull().default(false),
	createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow(),
	updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow(),
});

export const tagRelations = relations(tagTable, ({ many }) => ({
	projects: many(projectTagTable),
	timeEntries: many(timeEntryTagTable),
}));

export type Tag = InferSelectModel<typeof tagTable> & {
	projects: ProjectTag[];
	timeEntries: TimeEntryTag[];
};
