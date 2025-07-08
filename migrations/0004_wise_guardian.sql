ALTER TABLE "users" ADD COLUMN "dot_balance" numeric(36, 8) DEFAULT '0';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "sol_balance" numeric(36, 8) DEFAULT '0';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "doge_balance" numeric(36, 8) DEFAULT '0';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "trx_balance" numeric(36, 8) DEFAULT '0';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "xrp_balance" numeric(36, 8) DEFAULT '0';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "usdc_balance" numeric(36, 8) DEFAULT '0';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "ltc_balance" numeric(36, 8) DEFAULT '0';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "matic_balance" numeric(36, 8) DEFAULT '0';