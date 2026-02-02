CREATE TYPE "public"."highlight_type" AS ENUM('included', 'excluded');--> statement-breakpoint
CREATE TYPE "public"."offer_category" AS ENUM('experience', 'package', 'dining', 'spa', 'adventure', 'cultural', 'romantic', 'family');--> statement-breakpoint
CREATE TYPE "public"."offer_status" AS ENUM('draft', 'active', 'expired', 'archived');--> statement-breakpoint
CREATE TABLE "offer_faqs" (
	"faq_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"offer_id" uuid NOT NULL,
	"order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "offer_highlights" (
	"id" serial PRIMARY KEY NOT NULL,
	"offer_id" uuid NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"text" text NOT NULL,
	"type" "highlight_type" DEFAULT 'included' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "offer_images" (
	"caption" text,
	"id" serial PRIMARY KEY NOT NULL,
	"image_id" integer NOT NULL,
	"offer_id" uuid NOT NULL,
	"order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "offer_itinerary" (
	"admission_included" boolean DEFAULT false,
	"description" text,
	"duration" varchar(100),
	"id" serial PRIMARY KEY NOT NULL,
	"is_stop" boolean DEFAULT true,
	"location" varchar(255),
	"offer_id" uuid NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"title" varchar(255) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "offers" ADD COLUMN "category" "offer_category" DEFAULT 'experience' NOT NULL;--> statement-breakpoint
ALTER TABLE "offers" ADD COLUMN "slug" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "offers" ADD COLUMN "status" "offer_status" DEFAULT 'draft' NOT NULL;--> statement-breakpoint
ALTER TABLE "offers" ADD COLUMN "discounted_price" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "offers" ADD COLUMN "original_price" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "offers" ADD COLUMN "price_per" varchar(50) DEFAULT 'person';--> statement-breakpoint
ALTER TABLE "offers" ADD COLUMN "duration" varchar(100);--> statement-breakpoint
ALTER TABLE "offers" ADD COLUMN "location" varchar(255);--> statement-breakpoint
ALTER TABLE "offers" ADD COLUMN "meeting_point" text;--> statement-breakpoint
ALTER TABLE "offers" ADD COLUMN "meeting_point_details" text;--> statement-breakpoint
ALTER TABLE "offers" ADD COLUMN "languages" text;--> statement-breakpoint
ALTER TABLE "offers" ADD COLUMN "max_group_size" integer;--> statement-breakpoint
ALTER TABLE "offers" ADD COLUMN "min_group_size" integer DEFAULT 1;--> statement-breakpoint
ALTER TABLE "offers" ADD COLUMN "booking_notice" text;--> statement-breakpoint
ALTER TABLE "offers" ADD COLUMN "cancellation_deadline" varchar(100);--> statement-breakpoint
ALTER TABLE "offers" ADD COLUMN "cancellation_policy" text;--> statement-breakpoint
ALTER TABLE "offers" ADD COLUMN "free_cancellation" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "offers" ADD COLUMN "rating" numeric(2, 1);--> statement-breakpoint
ALTER TABLE "offers" ADD COLUMN "review_count" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "offers" ADD COLUMN "meta_description" text;--> statement-breakpoint
ALTER TABLE "offers" ADD COLUMN "meta_title" varchar(255);--> statement-breakpoint
ALTER TABLE "offers" ADD COLUMN "created_at" timestamp (0) DEFAULT now();--> statement-breakpoint
ALTER TABLE "offers" ADD COLUMN "updated_at" timestamp (0) DEFAULT now();--> statement-breakpoint
ALTER TABLE "offers" ADD COLUMN "valid_from" timestamp (0);--> statement-breakpoint
ALTER TABLE "offers" ADD COLUMN "valid_until" timestamp (0);--> statement-breakpoint
ALTER TABLE "offer_faqs" ADD CONSTRAINT "offer_faqs_faq_id_faqs_id_fk" FOREIGN KEY ("faq_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "offer_faqs" ADD CONSTRAINT "offer_faqs_offer_id_offers_id_fk" FOREIGN KEY ("offer_id") REFERENCES "public"."offers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "offer_highlights" ADD CONSTRAINT "offer_highlights_offer_id_offers_id_fk" FOREIGN KEY ("offer_id") REFERENCES "public"."offers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "offer_images" ADD CONSTRAINT "offer_images_image_id_images_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."images"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "offer_images" ADD CONSTRAINT "offer_images_offer_id_offers_id_fk" FOREIGN KEY ("offer_id") REFERENCES "public"."offers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "offer_itinerary" ADD CONSTRAINT "offer_itinerary_offer_id_offers_id_fk" FOREIGN KEY ("offer_id") REFERENCES "public"."offers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "offer_highlights_type_idx" ON "offer_highlights" USING btree ("type");--> statement-breakpoint
CREATE INDEX "offers_slug_idx" ON "offers" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "offers_category_idx" ON "offers" USING btree ("category");--> statement-breakpoint
CREATE INDEX "offers_status_idx" ON "offers" USING btree ("status");--> statement-breakpoint
CREATE INDEX "offers_active_idx" ON "offers" USING btree ("active");--> statement-breakpoint
ALTER TABLE "offers" ADD CONSTRAINT "offers_slug_unique" UNIQUE("slug");