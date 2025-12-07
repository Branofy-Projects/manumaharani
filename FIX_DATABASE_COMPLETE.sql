-- COMPLETE FIX: Run this entire script in your database
-- This will remove all resort_id constraints and foreign keys

-- Step 1: Drop foreign key constraints first
ALTER TABLE "room_types" DROP CONSTRAINT IF EXISTS "room_types_resort_id_resort_id_fk";
ALTER TABLE "rooms" DROP CONSTRAINT IF EXISTS "rooms_resort_id_resort_id_fk";
ALTER TABLE "gallery" DROP CONSTRAINT IF EXISTS "gallery_resort_id_resort_id_fk";
ALTER TABLE "testimonials" DROP CONSTRAINT IF EXISTS "testimonials_resort_id_resort_id_fk";

-- Step 2: Make columns nullable
ALTER TABLE "room_types" ALTER COLUMN "resort_id" DROP NOT NULL;
ALTER TABLE "rooms" ALTER COLUMN "resort_id" DROP NOT NULL;
ALTER TABLE "gallery" ALTER COLUMN "resort_id" DROP NOT NULL;
ALTER TABLE "testimonials" ALTER COLUMN "resort_id" DROP NOT NULL;

-- Step 3: Drop indexes if they exist
DROP INDEX IF EXISTS "room_types_resort_id_idx";
DROP INDEX IF EXISTS "rooms_resort_id_idx";
DROP INDEX IF EXISTS "gallery_resort_id_idx";
DROP INDEX IF EXISTS "testimonials_resort_id_idx";

