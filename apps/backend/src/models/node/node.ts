import { InferSelectModel, relations } from "drizzle-orm";
import {
	AnyPgColumn,
	boolean,
	decimal,
	doublePrecision,
	integer,
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import { Project, projectTable } from "../project/project";
import { Nullable } from "~types/supportTypes";

export enum NodeType {
	task = 0,
	folder = 1,
}

export const nodeTable = pgTable("node", {
	id: uuid("id").primaryKey().defaultRandom(),

	name: text("name").notNull(),
	type: integer("type").notNull().default(NodeType.task),
	colorId: integer("colorId"),
	cachedColorId: integer("cachedColorId").notNull(),
	order: decimal("order").notNull().default("1000"),
	isCompleted: boolean("isCompleted").notNull().default(false),
	isDeleted: boolean("isDeleted").notNull().default(false),
	confirmedDuration: doublePrecision("confirmedDuration").notNull().default(0),
	note: text("note"),
	createdAt: timestamp("createdAt", { withTimezone: false }).defaultNow(),
	updatedAt: timestamp("updatedAt", { withTimezone: false }).defaultNow(),
	parentIds: uuid("parentIds").array(),

	parentId: uuid("parentId").references((): AnyPgColumn => nodeTable.id, { onDelete: "cascade" }),
	projectId: uuid("projectId").references(() => projectTable.id),
});

export const nodeRelations = relations(nodeTable, ({ one }) => ({
	project: one(projectTable, {
		fields: [nodeTable.projectId],
		references: [projectTable.id],
	}),
	parent: one(nodeTable, {
		fields: [nodeTable.parentId],
		references: [nodeTable.id],
	}),
}));

export type Node = InferSelectModel<typeof nodeTable> & {
	parent?: Nullable<Node>;
	project?: Project;
};
