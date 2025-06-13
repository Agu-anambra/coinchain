import { pgTable, unique, uuid, varchar, text, date, timestamp, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const role = pgEnum("role", ['USER', 'ADMIN'])
export const status = pgEnum("status", ['PENDING', 'APPROVED', 'REJECTED'])


export const users = pgTable("users", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	fullName: varchar("full_name", { length: 255 }).notNull(),
	email: text().notNull(),
	password: text().notNull(),
	idCard: text("id_card").notNull(),
	status: status().default('PENDING'),
	role: role().default('USER'),
	lastActivityDate: date("last_activity_date").defaultNow(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	unique("users_email_unique").on(table.email),
]);
