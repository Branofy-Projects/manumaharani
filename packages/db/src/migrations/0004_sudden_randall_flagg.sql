CREATE TYPE "public"."blog_category" AS ENUM('travel', 'wildlife', 'luxury', 'adventure', 'wellness', 'culinary', 'events', 'offers', 'general');--> statement-breakpoint
CREATE TYPE "public"."blog_status" AS ENUM('draft', 'published', 'archived');--> statement-breakpoint
CREATE TYPE "public"."booking_status" AS ENUM('pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled', 'no_show');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('pending', 'partial', 'paid', 'refunded');--> statement-breakpoint
CREATE TYPE "public"."gallery_category" AS ENUM('rooms', 'dining', 'spa', 'activities', 'facilities', 'events', 'surroundings', 'general');--> statement-breakpoint
CREATE TYPE "public"."gallery_type" AS ENUM('image', 'video');--> statement-breakpoint
CREATE TYPE "public"."policy_kind" AS ENUM('include', 'exclude');--> statement-breakpoint
CREATE TYPE "public"."bed_type" AS ENUM('single', 'double', 'queen', 'king', 'twin');--> statement-breakpoint
CREATE TYPE "public"."room_type_status" AS ENUM('active', 'inactive');--> statement-breakpoint
CREATE TYPE "public"."room_status" AS ENUM('available', 'occupied', 'maintenance', 'blocked');--> statement-breakpoint
CREATE TYPE "public"."testimonial_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TABLE "amenities" (
	"icon" text NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"label" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "blog_images" (
	"blog_id" integer NOT NULL,
	"caption" text,
	"id" serial PRIMARY KEY NOT NULL,
	"image_id" integer NOT NULL,
	"order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "blogs" (
	"id" serial PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"excerpt" text NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"author_id" text,
	"author_name" varchar(255),
	"featured_image_id" integer,
	"category" "blog_category" DEFAULT 'general' NOT NULL,
	"tags" text,
	"meta_description" text,
	"meta_keywords" text,
	"meta_title" text,
	"published_at" timestamp,
	"status" "blog_status" DEFAULT 'draft' NOT NULL,
	"is_featured" integer DEFAULT 0 NOT NULL,
	"view_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp (0) DEFAULT now(),
	"updated_at" timestamp (0) DEFAULT now(),
	CONSTRAINT "blogs_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "booking_payments" (
	"booking_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"payment_method" text NOT NULL,
	"payment_notes" text,
	"payment_reference" varchar(255),
	"created_at" timestamp (0) DEFAULT now(),
	"paid_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bookings" (
	"id" serial PRIMARY KEY NOT NULL,
	"guest_address" text,
	"guest_email" varchar(255) NOT NULL,
	"guest_id_proof_number" varchar(100),
	"guest_id_proof_type" text,
	"guest_name" text NOT NULL,
	"guest_phone" varchar(255) NOT NULL,
	"user_id" text,
	"room_id" integer,
	"room_type_id" integer NOT NULL,
	"check_in_date" date NOT NULL,
	"check_out_date" date NOT NULL,
	"number_of_nights" integer NOT NULL,
	"number_of_adults" integer DEFAULT 1 NOT NULL,
	"number_of_children" integer DEFAULT 0 NOT NULL,
	"number_of_rooms" integer DEFAULT 1 NOT NULL,
	"discount_amount" numeric(10, 2) DEFAULT '0' NOT NULL,
	"paid_amount" numeric(10, 2) DEFAULT '0' NOT NULL,
	"room_price_per_night" numeric(10, 2) NOT NULL,
	"tax_amount" numeric(10, 2) DEFAULT '0' NOT NULL,
	"total_amount" numeric(10, 2) NOT NULL,
	"total_room_price" numeric(10, 2) NOT NULL,
	"dietary_requirements" text,
	"special_requests" text,
	"booking_status" "booking_status" DEFAULT 'pending' NOT NULL,
	"payment_status" "payment_status" DEFAULT 'pending' NOT NULL,
	"admin_notes" text,
	"booking_source" text DEFAULT 'website',
	"confirmation_code" varchar(50),
	"booking_date" timestamp DEFAULT now() NOT NULL,
	"cancellation_reason" text,
	"cancelled_at" timestamp,
	"check_in_time" timestamp,
	"check_out_time" timestamp,
	"created_at" timestamp (0) DEFAULT now(),
	"updated_at" timestamp (0) DEFAULT now(),
	CONSTRAINT "bookings_confirmation_code_unique" UNIQUE("confirmation_code")
);
--> statement-breakpoint
CREATE TABLE "faqs" (
	"answer" text NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"question" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gallery" (
	"id" serial PRIMARY KEY NOT NULL,
	"description" text,
	"title" text NOT NULL,
	"image_id" integer,
	"type" "gallery_type" DEFAULT 'image' NOT NULL,
	"video_thumbnail_id" integer,
	"video_url" text,
	"category" "gallery_category" DEFAULT 'general' NOT NULL,
	"is_featured" integer DEFAULT 0 NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp (0) DEFAULT now(),
	"updated_at" timestamp (0) DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "images" (
	"alt_text" text DEFAULT '' NOT NULL,
	"created_at" timestamp (0) DEFAULT now(),
	"id" serial PRIMARY KEY NOT NULL,
	"large_url" text NOT NULL,
	"medium_url" text NOT NULL,
	"original_url" text NOT NULL,
	"small_url" text NOT NULL,
	"updated_at" timestamp (0) DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "policies" (
	"id" serial PRIMARY KEY NOT NULL,
	"kind" "policy_kind" NOT NULL,
	"label" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "room_type_amenities" (
	"amenity_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"room_type_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "room_type_faqs" (
	"faq_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"room_type_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "room_type_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"image_id" integer NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"room_type_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "room_type_policies" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"policy_id" integer NOT NULL,
	"room_type_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "room_types" (
	"id" serial PRIMARY KEY NOT NULL,
	"description" text NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"bed_type" "bed_type" NOT NULL,
	"max_occupancy" integer DEFAULT 2 NOT NULL,
	"number_of_beds" integer DEFAULT 1 NOT NULL,
	"size_sqft" integer NOT NULL,
	"base_price" numeric(10, 2) DEFAULT '0' NOT NULL,
	"peak_season_price" numeric(10, 2),
	"weekend_price" numeric(10, 2),
	"is_featured" integer DEFAULT 0 NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"status" "room_type_status" DEFAULT 'active',
	"created_at" timestamp (0) DEFAULT now(),
	"updated_at" timestamp (0) DEFAULT now(),
	CONSTRAINT "room_types_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "room_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"room_id" integer NOT NULL,
	"image_id" integer NOT NULL,
	"order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rooms" (
	"id" serial PRIMARY KEY NOT NULL,
	"room_type_id" integer NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"floor" integer NOT NULL,
	"room_number" varchar(50) NOT NULL,
	"status" "room_status" DEFAULT 'available',
	"notes" text,
	"created_at" timestamp (0) DEFAULT now(),
	"updated_at" timestamp (0) DEFAULT now(),
	CONSTRAINT "rooms_room_number_unique" UNIQUE("room_number")
);
--> statement-breakpoint
CREATE TABLE "testimonials" (
	"id" serial PRIMARY KEY NOT NULL,
	"guest_avatar_id" integer,
	"guest_email" varchar(255),
	"guest_location" text,
	"guest_name" text NOT NULL,
	"user_id" text,
	"content" text NOT NULL,
	"rating" integer NOT NULL,
	"title" text,
	"platform" text DEFAULT 'website',
	"stay_date" timestamp,
	"is_featured" integer DEFAULT 0 NOT NULL,
	"status" "testimonial_status" DEFAULT 'pending' NOT NULL,
	"admin_notes" text,
	"created_at" timestamp (0) DEFAULT now(),
	"updated_at" timestamp (0) DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "blog_images" ADD CONSTRAINT "blog_images_blog_id_blogs_id_fk" FOREIGN KEY ("blog_id") REFERENCES "public"."blogs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_images" ADD CONSTRAINT "blog_images_image_id_images_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."images"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blogs" ADD CONSTRAINT "blogs_author_id_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blogs" ADD CONSTRAINT "blogs_featured_image_id_images_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."images"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "booking_payments" ADD CONSTRAINT "booking_payments_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_room_id_rooms_id_fk" FOREIGN KEY ("room_id") REFERENCES "public"."rooms"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_room_type_id_room_types_id_fk" FOREIGN KEY ("room_type_id") REFERENCES "public"."room_types"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gallery" ADD CONSTRAINT "gallery_image_id_images_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."images"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gallery" ADD CONSTRAINT "gallery_video_thumbnail_id_images_id_fk" FOREIGN KEY ("video_thumbnail_id") REFERENCES "public"."images"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "room_type_amenities" ADD CONSTRAINT "room_type_amenities_amenity_id_amenities_id_fk" FOREIGN KEY ("amenity_id") REFERENCES "public"."amenities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "room_type_amenities" ADD CONSTRAINT "room_type_amenities_room_type_id_room_types_id_fk" FOREIGN KEY ("room_type_id") REFERENCES "public"."room_types"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "room_type_faqs" ADD CONSTRAINT "room_type_faqs_faq_id_faqs_id_fk" FOREIGN KEY ("faq_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "room_type_faqs" ADD CONSTRAINT "room_type_faqs_room_type_id_room_types_id_fk" FOREIGN KEY ("room_type_id") REFERENCES "public"."room_types"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "room_type_images" ADD CONSTRAINT "room_type_images_image_id_images_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."images"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "room_type_images" ADD CONSTRAINT "room_type_images_room_type_id_room_types_id_fk" FOREIGN KEY ("room_type_id") REFERENCES "public"."room_types"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "room_type_policies" ADD CONSTRAINT "room_type_policies_policy_id_policies_id_fk" FOREIGN KEY ("policy_id") REFERENCES "public"."policies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "room_type_policies" ADD CONSTRAINT "room_type_policies_room_type_id_room_types_id_fk" FOREIGN KEY ("room_type_id") REFERENCES "public"."room_types"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "room_images" ADD CONSTRAINT "room_images_room_id_rooms_id_fk" FOREIGN KEY ("room_id") REFERENCES "public"."rooms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "room_images" ADD CONSTRAINT "room_images_image_id_images_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."images"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_room_type_id_room_types_id_fk" FOREIGN KEY ("room_type_id") REFERENCES "public"."room_types"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_guest_avatar_id_images_id_fk" FOREIGN KEY ("guest_avatar_id") REFERENCES "public"."images"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "blogs_slug_idx" ON "blogs" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "blogs_author_id_idx" ON "blogs" USING btree ("author_id");--> statement-breakpoint
CREATE INDEX "blogs_category_idx" ON "blogs" USING btree ("category");--> statement-breakpoint
CREATE INDEX "blogs_status_idx" ON "blogs" USING btree ("status");--> statement-breakpoint
CREATE INDEX "blogs_published_at_idx" ON "blogs" USING btree ("published_at");--> statement-breakpoint
CREATE INDEX "blogs_is_featured_idx" ON "blogs" USING btree ("is_featured");--> statement-breakpoint
CREATE INDEX "blogs_status_published_idx" ON "blogs" USING btree ("status","published_at");--> statement-breakpoint
CREATE INDEX "booking_payments_booking_id_idx" ON "booking_payments" USING btree ("booking_id");--> statement-breakpoint
CREATE INDEX "booking_payments_paid_at_idx" ON "booking_payments" USING btree ("paid_at");--> statement-breakpoint
CREATE INDEX "bookings_guest_email_idx" ON "bookings" USING btree ("guest_email");--> statement-breakpoint
CREATE INDEX "bookings_guest_phone_idx" ON "bookings" USING btree ("guest_phone");--> statement-breakpoint
CREATE INDEX "bookings_user_id_idx" ON "bookings" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "bookings_room_type_id_idx" ON "bookings" USING btree ("room_type_id");--> statement-breakpoint
CREATE INDEX "bookings_room_id_idx" ON "bookings" USING btree ("room_id");--> statement-breakpoint
CREATE INDEX "bookings_check_in_date_idx" ON "bookings" USING btree ("check_in_date");--> statement-breakpoint
CREATE INDEX "bookings_check_out_date_idx" ON "bookings" USING btree ("check_out_date");--> statement-breakpoint
CREATE INDEX "bookings_booking_status_idx" ON "bookings" USING btree ("booking_status");--> statement-breakpoint
CREATE INDEX "bookings_payment_status_idx" ON "bookings" USING btree ("payment_status");--> statement-breakpoint
CREATE INDEX "bookings_confirmation_code_idx" ON "bookings" USING btree ("confirmation_code");--> statement-breakpoint
CREATE INDEX "bookings_booking_date_idx" ON "bookings" USING btree ("booking_date");--> statement-breakpoint
CREATE INDEX "bookings_dates_status_idx" ON "bookings" USING btree ("check_in_date","check_out_date","booking_status");--> statement-breakpoint
CREATE INDEX "gallery_type_idx" ON "gallery" USING btree ("type");--> statement-breakpoint
CREATE INDEX "gallery_category_idx" ON "gallery" USING btree ("category");--> statement-breakpoint
CREATE INDEX "gallery_is_featured_idx" ON "gallery" USING btree ("is_featured");--> statement-breakpoint
CREATE INDEX "images_created_at_idx" ON "images" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "policies_kind_idx" ON "policies" USING btree ("kind");--> statement-breakpoint
CREATE INDEX "policies_label_idx" ON "policies" USING btree ("label");--> statement-breakpoint
CREATE INDEX "room_types_slug_idx" ON "room_types" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "room_types_status_idx" ON "room_types" USING btree ("status");--> statement-breakpoint
CREATE INDEX "room_types_is_featured_idx" ON "room_types" USING btree ("is_featured");--> statement-breakpoint
CREATE INDEX "rooms_room_number_idx" ON "rooms" USING btree ("room_number");--> statement-breakpoint
CREATE INDEX "rooms_room_type_id_idx" ON "rooms" USING btree ("room_type_id");--> statement-breakpoint
CREATE INDEX "rooms_status_idx" ON "rooms" USING btree ("status");--> statement-breakpoint
CREATE INDEX "rooms_floor_idx" ON "rooms" USING btree ("floor");--> statement-breakpoint
CREATE INDEX "testimonials_user_id_idx" ON "testimonials" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "testimonials_status_idx" ON "testimonials" USING btree ("status");--> statement-breakpoint
CREATE INDEX "testimonials_rating_idx" ON "testimonials" USING btree ("rating");--> statement-breakpoint
CREATE INDEX "testimonials_is_featured_idx" ON "testimonials" USING btree ("is_featured");