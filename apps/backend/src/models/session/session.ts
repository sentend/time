import { InferSelectModel, relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { User, userTable } from "../user/user";
import dayjs from "dayjs";

const sessionExpiredTime = process.env.SESSION_EXPIRATION_TIME_IN_HOURS
	? parseInt(process.env.SESSION_EXPIRATION_TIME_IN_HOURS) || 24
	: 24;

export const sessionTable = pgTable("session", {
	id: uuid("id").primaryKey().defaultRandom(),

	userId: uuid("userId")
		.notNull()
		.references(() => userTable.id, { onDelete: "cascade" }),
	expTime: timestamp("expTime", { withTimezone: true })
		.notNull()
		.$defaultFn(() => dayjs().add(sessionExpiredTime, "h").toDate()),
	createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow(),
	updatedAt: timestamp("updatedAt", { withTimezone: true }).notNull().defaultNow(),
});

export const sessionRelations = relations(sessionTable, ({ one, many }) => ({
	user: one(userTable, {
		fields: [sessionTable.userId],
		references: [userTable.id],
	}),
}));

export type Session = InferSelectModel<typeof sessionTable> & {
	user: User;
};
