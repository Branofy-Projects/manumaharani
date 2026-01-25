ALTER TABLE "events" ADD COLUMN "start_time" varchar(10) DEFAULT '08:00' NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "end_time" varchar(10) DEFAULT '16:00' NOT NULL;