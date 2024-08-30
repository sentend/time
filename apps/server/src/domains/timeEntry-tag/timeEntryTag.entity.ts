import {
	integer,
	pgTable,
	primaryKey,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import { Tag, tagTable } from "../tag/tag.entity";
import { TimeEntry, timeEntryTable } from "../timeEntry/timeEntry.entity";
import { InferSelectModel, relations } from "drizzle-orm";

export const timeEntryTagTable = pgTable(
	"timeEntryTag",
	{
		tagId: uuid("tagId")
			.notNull()
			.references(() => tagTable.id),
		timeEntryId: uuid("timeEntryId")
			.notNull()
			.references(() => timeEntryTable.id),

		order: integer("order").notNull().default(0),

		createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow(),
		updatedAt: timestamp("updatedAt", { withTimezone: true })
			.notNull()
			.defaultNow(),
	},
	table => ({
		pk: primaryKey({ columns: [table.tagId, table.timeEntryId] }),
	}),
);

export const timeEntryTagRelations = relations(
	timeEntryTagTable,
	({ many, one }) => ({
		timeEntry: one(timeEntryTable, {
			fields: [timeEntryTagTable.timeEntryId],
			references: [timeEntryTable.id],
		}),
		tag: one(tagTable, {
			fields: [timeEntryTagTable.tagId],
			references: [tagTable.id],
		}),
	}),
);

export type TimeEntryTag = InferSelectModel<typeof timeEntryTagTable> & {
	timeEntry: TimeEntry;
	tag: Tag;
};
