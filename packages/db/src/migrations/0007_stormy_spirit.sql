DROP INDEX "events_date_idx";--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "end_date" date;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "excerpt" text NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "start_date" date NOT NULL;--> statement-breakpoint
ALTER TABLE "offers" ADD COLUMN "excerpt" text NOT NULL;--> statement-breakpoint
CREATE INDEX "events_start_date_idx" ON "events" USING btree ("start_date");--> statement-breakpoint
CREATE INDEX "events_end_date_idx" ON "events" USING btree ("end_date");--> statement-breakpoint
CREATE INDEX "events_start_date_end_date_idx" ON "events" USING btree ("start_date","end_date");--> statement-breakpoint
ALTER TABLE "events" DROP COLUMN "date";