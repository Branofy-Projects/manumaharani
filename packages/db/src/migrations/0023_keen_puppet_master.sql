CREATE TABLE "event_faqs" (
	"event_id" uuid NOT NULL,
	"faq_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "event_highlights" (
	"event_id" uuid NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"text" text NOT NULL,
	"type" "highlight_type" DEFAULT 'included' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "event_images" (
	"caption" text,
	"event_id" uuid NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"image_id" integer NOT NULL,
	"order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "event_itinerary" (
	"admission_included" boolean DEFAULT false,
	"description" text,
	"duration" varchar(100),
	"event_id" uuid NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"is_stop" boolean DEFAULT true,
	"location" varchar(255),
	"order" integer DEFAULT 0 NOT NULL,
	"title" varchar(255) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "location" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "location" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "category" "offer_category" DEFAULT 'experience' NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "slug" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "active" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "status" "offer_status" DEFAULT 'draft' NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "discounted_price" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "original_price" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "price_per" varchar(50) DEFAULT 'person';--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "duration" varchar(100);--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "meeting_point" text;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "meeting_point_details" text;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "languages" text;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "max_group_size" integer;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "min_group_size" integer DEFAULT 1;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "booking_notice" text;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "link" text NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "cancellation_deadline" varchar(100);--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "cancellation_policy" text;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "free_cancellation" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "rating" numeric(2, 1);--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "review_count" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "meta_description" text;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "meta_title" varchar(255);--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "created_at" timestamp (0) DEFAULT now();--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "updated_at" timestamp (0) DEFAULT now();--> statement-breakpoint
ALTER TABLE "event_faqs" ADD CONSTRAINT "event_faqs_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_faqs" ADD CONSTRAINT "event_faqs_faq_id_faqs_id_fk" FOREIGN KEY ("faq_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_highlights" ADD CONSTRAINT "event_highlights_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_images" ADD CONSTRAINT "event_images_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_images" ADD CONSTRAINT "event_images_image_id_images_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."images"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_itinerary" ADD CONSTRAINT "event_itinerary_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "event_highlights_type_idx" ON "event_highlights" USING btree ("type");--> statement-breakpoint
CREATE INDEX "events_slug_idx" ON "events" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "events_category_idx" ON "events" USING btree ("category");--> statement-breakpoint
CREATE INDEX "events_status_idx" ON "events" USING btree ("status");--> statement-breakpoint
CREATE INDEX "events_active_idx" ON "events" USING btree ("active");--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_slug_unique" UNIQUE("slug");