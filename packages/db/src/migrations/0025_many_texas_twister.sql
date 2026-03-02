CREATE TABLE "room_amenities" (
	"amenity_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"room_id" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "rooms" DROP CONSTRAINT "rooms_room_number_unique";--> statement-breakpoint
ALTER TABLE "rooms" DROP CONSTRAINT "rooms_room_type_id_room_types_id_fk";
--> statement-breakpoint
DROP INDEX "rooms_room_number_idx";--> statement-breakpoint
DROP INDEX "rooms_room_type_id_idx";--> statement-breakpoint
DROP INDEX "rooms_floor_idx";--> statement-breakpoint
ALTER TABLE "rooms" ALTER COLUMN "floor" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "rooms" ALTER COLUMN "room_number" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "attractions" ADD COLUMN "close_time" varchar(20);--> statement-breakpoint
ALTER TABLE "attractions" ADD COLUMN "faq" text;--> statement-breakpoint
ALTER TABLE "attractions" ADD COLUMN "open_time" varchar(20);--> statement-breakpoint
ALTER TABLE "rooms" ADD COLUMN "slug" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "rooms" ADD COLUMN "image" integer;--> statement-breakpoint
ALTER TABLE "rooms" ADD COLUMN "video_url" text;--> statement-breakpoint
ALTER TABLE "rooms" ADD COLUMN "bed_type" "bed_type" DEFAULT 'double' NOT NULL;--> statement-breakpoint
ALTER TABLE "rooms" ADD COLUMN "max_occupancy" integer DEFAULT 2 NOT NULL;--> statement-breakpoint
ALTER TABLE "rooms" ADD COLUMN "number_of_beds" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "rooms" ADD COLUMN "size_sqft" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "rooms" ADD COLUMN "check_in_time" varchar(20);--> statement-breakpoint
ALTER TABLE "rooms" ADD COLUMN "check_out_time" varchar(20);--> statement-breakpoint
ALTER TABLE "rooms" ADD COLUMN "children_policy" text;--> statement-breakpoint
ALTER TABLE "rooms" ADD COLUMN "extra_beds" text;--> statement-breakpoint
ALTER TABLE "rooms" ADD COLUMN "base_price" numeric(10, 2) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "rooms" ADD COLUMN "peak_season_price" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "rooms" ADD COLUMN "weekend_price" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "rooms" ADD COLUMN "rating" numeric(2, 1);--> statement-breakpoint
ALTER TABLE "rooms" ADD COLUMN "review_count" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "rooms" ADD COLUMN "is_featured" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "rooms" ADD COLUMN "order" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "room_amenities" ADD CONSTRAINT "room_amenities_amenity_id_amenities_id_fk" FOREIGN KEY ("amenity_id") REFERENCES "public"."amenities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "room_amenities" ADD CONSTRAINT "room_amenities_room_id_rooms_id_fk" FOREIGN KEY ("room_id") REFERENCES "public"."rooms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "room_amenities_room_id_idx" ON "room_amenities" USING btree ("room_id");--> statement-breakpoint
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_image_images_id_fk" FOREIGN KEY ("image") REFERENCES "public"."images"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "rooms_slug_idx" ON "rooms" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "rooms_is_featured_idx" ON "rooms" USING btree ("is_featured");--> statement-breakpoint
CREATE INDEX "rooms_order_idx" ON "rooms" USING btree ("order");--> statement-breakpoint
ALTER TABLE "rooms" DROP COLUMN "room_type_id";--> statement-breakpoint
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_slug_unique" UNIQUE("slug");