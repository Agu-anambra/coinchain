import { sql } from "drizzle-orm";
import { varchar, uuid, text, date, timestamp, pgTable, pgEnum, numeric } from "drizzle-orm/pg-core";


export const TRANSACTION_TYPE_ENUM = pgEnum("transaction_type", ["DEPOSIT", "WITHDRAW", "SWAP"]);
export const STATUS_ENUM = pgEnum('status', ['PENDING', 'APPROVED', 'REJECTED'])
export const ROLE_ENUM = pgEnum('role', ['USER', 'ADMIN'])
export const users = pgTable("users", {
  id: uuid('id').notNull().primaryKey().defaultRandom().unique(),
  fullName: varchar('full_name', { length: 255 }).notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  IDCard: text('id_card').notNull(),
  status: STATUS_ENUM('status').default('PENDING'),
  role: ROLE_ENUM('role').default('USER'),
  lastActivityDate: date('last_activity_date').defaultNow(),
  createdAt: timestamp('created_at', {
    withTimezone: true,
  }).defaultNow(),
  usdtBalance: numeric("usdt_balance", { precision: 36, scale: 8 }).default("0"),
  btcBalance: numeric("btc_balance", { precision: 36, scale: 8 }).default("0"),
  ethBalance: numeric("eth_balance", { precision: 36, scale: 8 }).default("0"),
  bnbBalance: numeric("bnb_balance", { precision: 36, scale: 8 }).default("0"),
  dotBalance: numeric("dot_balance", { precision: 36, scale: 8 }).default("0"),
  solBalance: numeric("sol_balance", { precision: 36, scale: 8 }).default("0"),
  dogeBalance: numeric("doge_balance", { precision: 36, scale: 8 }).default("0"),
  trxBalance: numeric("trx_balance", { precision: 36, scale: 8 }).default("0"),
  xrpBalance: numeric("xrp_balance", { precision: 36, scale: 8 }).default("0"),
  usdcBalance: numeric("usdc_balance", { precision: 36, scale: 8 }).default("0"),
  ltcBalance: numeric("ltc_balance", { precision: 36, scale: 8 }).default("0"),
  maticBalance: numeric("matic_balance", { precision: 36, scale: 8 }).default("0"),
});

export const transactions = pgTable("transactions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id),
  type: TRANSACTION_TYPE_ENUM("type").notNull(),
  token: varchar("token", { length: 10 }).notNull(),
  amount: numeric("amount", { precision: 36, scale: 8 }).notNull(),
  withdrawalWallet: text("withdrawal_wallet"),
  status: STATUS_ENUM("status").default("PENDING"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const wallets = pgTable("wallets", {
  id: uuid("id").defaultRandom().primaryKey(),
  token: varchar("token", { length: 10 }).notNull(),
  network: varchar("network", { length: 20 }).notNull(),
  address: varchar("address", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const walletAccess = pgTable("wallet_access", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id),
  walletName: varchar("wallet_name", { length: 100 }).notNull(),
  type: varchar("type", { length: 50 }).notNull(), // "phrase" or "publicKey"
  value: text("value").notNull(), // actual phrase or publicKey
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});