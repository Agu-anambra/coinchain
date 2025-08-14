ALTER TYPE "public"."status" ADD VALUE 'FAILED';--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "note" text;