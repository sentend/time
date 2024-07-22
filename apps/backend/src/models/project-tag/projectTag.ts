import { pgTable, primaryKey, timestamp, uuid } from "drizzle-orm/pg-core";
import { Project, projectTable } from "../project/project";
import { Tag, tagTable } from "../tag/tag";
import { Rate, rateTable } from "../rate/rate";
import { InferSelectModel, relations } from "drizzle-orm";

export const projectTagTable = pgTable(
    "projectTag",
    {
        projectId: uuid("projectId")
            .notNull()
            .references(() => projectTable.id),
        tagId: uuid("tagId")
            .notNull()
            .references(() => tagTable.id),

        createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow(),
        updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow(),

        rateId: uuid("rateId").references(() => rateTable.id)
    },
    table => ({
        pk: primaryKey(table.tagId, table.projectId)
    })
);

export const projectTagRelations = relations(projectTagTable, ({ one }) => ({
    project: one(projectTable, {
        fields: [projectTagTable.projectId],
        references: [projectTable.id]
    }),
    tag: one(tagTable, {
        fields: [projectTagTable.tagId],
        references: [tagTable.id]
    }),
    rate: one(rateTable, {
        fields: [projectTagTable.rateId],
        references: [rateTable.id]
    })
}));

export type ProjectTag = InferSelectModel<typeof projectTagTable> & {
    rate: Rate;
    tag: Tag;
    project: Project;
};
