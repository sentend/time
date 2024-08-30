import {
	boolean,
	pgTable,
	primaryKey,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import { Project, projectTable } from "../project/project.entity";
import { User, userTable } from "../user/user.entity";
import { Rate, rateTable } from "../rate/rate.entity";
import {
	InferSelectModel,
	relations,
	type InferInsertModel,
} from "drizzle-orm";

export const projectMemberTable = pgTable("projectMember", {
	id: uuid("id").primaryKey().defaultRandom(),

	isManager: boolean("isManager").notNull().default(false),
	createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow(),
	updatedAt: timestamp("updatedAt", { withTimezone: true }).$onUpdateFn(
		() => new Date(),
	),

	rateId: uuid("rateId").references(() => rateTable.id),
	projectId: uuid("projectId")
		.notNull()
		.references(() => projectTable.id, { onDelete: "cascade" }),
	userId: uuid("userId")
		.notNull()
		.references(() => userTable.id, { onDelete: "cascade" }),
});

export const userProjectRelations = relations(
	projectMemberTable,
	({ one }) => ({
		user: one(userTable, {
			fields: [projectMemberTable.userId],
			references: [userTable.id],
		}),
		project: one(projectTable, {
			fields: [projectMemberTable.projectId],
			references: [projectTable.id],
		}),
		rate: one(rateTable, {
			fields: [projectMemberTable.rateId],
			references: [rateTable.id],
		}),
	}),
);

export type ProjectMember = InferSelectModel<typeof projectMemberTable> & {
	project?: Project;
	user?: User;
	rate?: Rate;
};

export type NewProjectMember = InferInsertModel<typeof projectMemberTable>;
