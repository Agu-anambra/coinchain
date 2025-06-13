import { varchar, uuid, integer, text, date, timestamp, pgTable, pgEnum } from "drizzle-orm/pg-core";


export const STATUS_ENUM = pgEnum( 'status', ['PENDING', 'APPROVED', 'REJECTED'] )
export const ROLE_ENUM = pgEnum( 'role', ['USER', 'ADMIN'] )
export const users = pgTable("users", {
//   id: integer("id").primaryKey(),
  id: uuid('id').notNull().primaryKey().defaultRandom().unique(),
  fullName: varchar('full_name', {length: 255}).notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  IDCard: text('id_card').notNull(),
  status: STATUS_ENUM('status').default('PENDING'),
  role: ROLE_ENUM('role').default('USER'),
  lastActivityDate: date('last_activity_date').defaultNow(),
  createdAt: timestamp('created_at',{
    withTimezone: true,
  }).defaultNow()
});
