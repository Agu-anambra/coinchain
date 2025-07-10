CREATE TYPE "public"."role" AS ENUM('USER', 'ADMIN');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('PENDING', 'APPROVED', 'REJECTED');--> statement-breakpoint
CREATE TYPE "public"."transaction_type" AS ENUM('DEPOSIT', 'WITHDRAW', 'SWAP');--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"type" "transaction_type" NOT NULL,
	"token" varchar(10) NOT NULL,
	"amount" numeric(36, 8) NOT NULL,
	"withdrawal_wallet" text,
	"status" "status" DEFAULT 'PENDING',
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"full_name" varchar(255) NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"id_card" text NOT NULL,
	"status" "status" DEFAULT 'PENDING',
	"role" "role" DEFAULT 'USER',
	"last_activity_date" date DEFAULT now(),
	"created_at" timestamp with time zone DEFAULT now(),
	"usdt_balance" numeric(36, 8) DEFAULT '0',
	"btc_balance" numeric(36, 8) DEFAULT '0',
	"eth_balance" numeric(36, 8) DEFAULT '0',
	"bnb_balance" numeric(36, 8) DEFAULT '0',
	"dot_balance" numeric(36, 8) DEFAULT '0',
	"sol_balance" numeric(36, 8) DEFAULT '0',
	"doge_balance" numeric(36, 8) DEFAULT '0',
	"trx_balance" numeric(36, 8) DEFAULT '0',
	"xrp_balance" numeric(36, 8) DEFAULT '0',
	"usdc_balance" numeric(36, 8) DEFAULT '0',
	"ltc_balance" numeric(36, 8) DEFAULT '0',
	"matic_balance" numeric(36, 8) DEFAULT '0',
	CONSTRAINT "users_id_unique" UNIQUE("id"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "wallet_access" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"wallet_name" varchar(100) NOT NULL,
	"type" varchar(50) NOT NULL,
	"value" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "wallets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"token" varchar(10) NOT NULL,
	"network" varchar(20) NOT NULL,
	"address" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wallet_access" ADD CONSTRAINT "wallet_access_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;