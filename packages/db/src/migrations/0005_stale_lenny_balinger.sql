CREATE TABLE "events" (
	"date" date NOT NULL,
	"description" text NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"image" integer NOT NULL,
	"location" text NOT NULL,
	"name" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "offers" (
	"description" text NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"image" integer,
	"link" text NOT NULL,
	"name" varchar(255) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "amenities" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "policies" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "testimonials" ADD COLUMN "comment" text;--> statement-breakpoint
ALTER TABLE "offers" ADD CONSTRAINT "offers_image_images_id_fk" FOREIGN KEY ("image") REFERENCES "public"."images"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "events_name_idx" ON "events" USING btree ("name");--> statement-breakpoint
CREATE INDEX "events_date_idx" ON "events" USING btree ("date");--> statement-breakpoint
CREATE INDEX "events_location_idx" ON "events" USING btree ("location");--> statement-breakpoint
CREATE INDEX "offers_name_idx" ON "offers" USING btree ("name");