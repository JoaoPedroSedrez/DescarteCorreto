ALTER TABLE "reports" ADD COLUMN "neighbordhood" text;--> statement-breakpoint
ALTER TABLE "reports" ADD COLUMN "city" text NOT NULL;--> statement-breakpoint
ALTER TABLE "reports" ADD COLUMN "state" text NOT NULL;--> statement-breakpoint
ALTER TABLE "reports" DROP COLUMN "latitude";--> statement-breakpoint
ALTER TABLE "reports" DROP COLUMN "longitude";