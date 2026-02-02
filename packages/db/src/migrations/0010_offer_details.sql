-- Migration: Add comprehensive offer details schema
-- This migration extends the offers table and adds supporting tables for offer details page

-- Create enums
DO $$ BEGIN
    CREATE TYPE "public"."offer_category" AS ENUM ('experience', 'package', 'dining', 'spa', 'adventure', 'cultural', 'romantic', 'family');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "public"."offer_status" AS ENUM ('draft', 'active', 'expired', 'archived');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "public"."highlight_type" AS ENUM ('included', 'excluded');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add new columns to offers table
ALTER TABLE "offers" ADD COLUMN IF NOT EXISTS "slug" varchar(255) UNIQUE;
ALTER TABLE "offers" ADD COLUMN IF NOT EXISTS "category" "offer_category" DEFAULT 'experience';
ALTER TABLE "offers" ADD COLUMN IF NOT EXISTS "status" "offer_status" DEFAULT 'draft';
ALTER TABLE "offers" ADD COLUMN IF NOT EXISTS "original_price" numeric(10, 2);
ALTER TABLE "offers" ADD COLUMN IF NOT EXISTS "discounted_price" numeric(10, 2);
ALTER TABLE "offers" ADD COLUMN IF NOT EXISTS "price_per" varchar(50) DEFAULT 'person';
ALTER TABLE "offers" ADD COLUMN IF NOT EXISTS "duration" varchar(100);
ALTER TABLE "offers" ADD COLUMN IF NOT EXISTS "location" varchar(255);
ALTER TABLE "offers" ADD COLUMN IF NOT EXISTS "meeting_point" text;
ALTER TABLE "offers" ADD COLUMN IF NOT EXISTS "meeting_point_details" text;
ALTER TABLE "offers" ADD COLUMN IF NOT EXISTS "max_group_size" integer;
ALTER TABLE "offers" ADD COLUMN IF NOT EXISTS "min_group_size" integer DEFAULT 1;
ALTER TABLE "offers" ADD COLUMN IF NOT EXISTS "languages" text;
ALTER TABLE "offers" ADD COLUMN IF NOT EXISTS "booking_notice" text;
ALTER TABLE "offers" ADD COLUMN IF NOT EXISTS "cancellation_policy" text;
ALTER TABLE "offers" ADD COLUMN IF NOT EXISTS "free_cancellation" boolean DEFAULT false;
ALTER TABLE "offers" ADD COLUMN IF NOT EXISTS "cancellation_deadline" varchar(100);
ALTER TABLE "offers" ADD COLUMN IF NOT EXISTS "rating" numeric(2, 1);
ALTER TABLE "offers" ADD COLUMN IF NOT EXISTS "review_count" integer DEFAULT 0;
ALTER TABLE "offers" ADD COLUMN IF NOT EXISTS "meta_title" varchar(255);
ALTER TABLE "offers" ADD COLUMN IF NOT EXISTS "meta_description" text;
ALTER TABLE "offers" ADD COLUMN IF NOT EXISTS "created_at" timestamp(0) DEFAULT now();
ALTER TABLE "offers" ADD COLUMN IF NOT EXISTS "updated_at" timestamp(0) DEFAULT now();
ALTER TABLE "offers" ADD COLUMN IF NOT EXISTS "valid_from" timestamp(0);
ALTER TABLE "offers" ADD COLUMN IF NOT EXISTS "valid_until" timestamp(0);

-- Generate slugs for existing offers (if any)
UPDATE "offers" 
SET "slug" = LOWER(REGEXP_REPLACE(name, '[^a-zA-Z0-9]+', '-', 'g'))
WHERE "slug" IS NULL;

-- Make slug NOT NULL after populating
ALTER TABLE "offers" ALTER COLUMN "slug" SET NOT NULL;

-- Create offer_images table
CREATE TABLE IF NOT EXISTS "offer_images" (
    "id" serial PRIMARY KEY NOT NULL,
    "offer_id" uuid NOT NULL REFERENCES "offers"("id") ON DELETE CASCADE,
    "image_id" integer NOT NULL REFERENCES "images"("id") ON DELETE CASCADE,
    "order" integer NOT NULL DEFAULT 0,
    "caption" text
);

-- Create offer_highlights table
CREATE TABLE IF NOT EXISTS "offer_highlights" (
    "id" serial PRIMARY KEY NOT NULL,
    "offer_id" uuid NOT NULL REFERENCES "offers"("id") ON DELETE CASCADE,
    "type" "highlight_type" NOT NULL DEFAULT 'included',
    "text" text NOT NULL,
    "order" integer NOT NULL DEFAULT 0
);

-- Create offer_itinerary table
CREATE TABLE IF NOT EXISTS "offer_itinerary" (
    "id" serial PRIMARY KEY NOT NULL,
    "offer_id" uuid NOT NULL REFERENCES "offers"("id") ON DELETE CASCADE,
    "title" varchar(255) NOT NULL,
    "description" text,
    "duration" varchar(100),
    "location" varchar(255),
    "order" integer NOT NULL DEFAULT 0,
    "is_stop" boolean DEFAULT true,
    "admission_included" boolean DEFAULT false
);

-- Create offer_faqs junction table
CREATE TABLE IF NOT EXISTS "offer_faqs" (
    "id" serial PRIMARY KEY NOT NULL,
    "offer_id" uuid NOT NULL REFERENCES "offers"("id") ON DELETE CASCADE,
    "faq_id" integer NOT NULL REFERENCES "faqs"("id") ON DELETE CASCADE,
    "order" integer NOT NULL DEFAULT 0
);

-- Create indexes
CREATE INDEX IF NOT EXISTS "offers_slug_idx" ON "offers" ("slug");
CREATE INDEX IF NOT EXISTS "offers_category_idx" ON "offers" ("category");
CREATE INDEX IF NOT EXISTS "offers_status_idx" ON "offers" ("status");
CREATE INDEX IF NOT EXISTS "offers_active_idx" ON "offers" ("active");
CREATE INDEX IF NOT EXISTS "offer_highlights_type_idx" ON "offer_highlights" ("type");
