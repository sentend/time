import { pgTable, primaryKey, timestamp, uuid } from "drizzle-orm/pg-core";
import { ProjectEntity, projectTable } from "../project/project.entity";
import { Tag, tagTable } from "../tag/tag.entity";
import { Rate, rateTable } from "../rate/rate.entity";
import { InferSelectModel, relations } from "drizzle-orm";

export const projectTagTable = pgTable(
	"projectTag",
	{
		projectId: uuid("projectId")
			.notNull()
			.references(() => projectTable.id, { onDelete: "cascade" }),
		tagId: uuid("tagId")
			.notNull()
			.references(() => tagTable.id, { onDelete: "cascade" }),

		createdAt: timestamp("createdAt", { withTimezone: false }).defaultNow(),
		updatedAt: timestamp("updatedAt", { withTimezone: false }).$onUpdateFn(
			() => new Date(),
		),

		rateId: uuid("rateId").references(() => rateTable.id),
	},
	table => ({
		pk: primaryKey({ columns: [table.tagId, table.projectId] }),
	}),
);

export const projectTagRelations = relations(projectTagTable, ({ one }) => ({
	project: one(projectTable, {
		fields: [projectTagTable.projectId],
		references: [projectTable.id],
	}),
	tag: one(tagTable, {
		fields: [projectTagTable.tagId],
		references: [tagTable.id],
	}),
	rate: one(rateTable, {
		fields: [projectTagTable.rateId],
		references: [rateTable.id],
	}),
}));

export type ProjectTag = InferSelectModel<typeof projectTagTable> & {
	rate: Rate;
	tag: Tag;
	project: ProjectEntity;
};
