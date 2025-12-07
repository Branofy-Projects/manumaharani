-- Fix database schema: Remove resort_id NOT NULL constraints
-- Run this SQL directly on your database

-- For room_types table
ALTER TABLE "room_types" 
  ALTER COLUMN "resort_id" DROP NOT NULL;

-- For rooms table
ALTER TABLE "rooms" 
  ALTER COLUMN "resort_id" DROP NOT NULL;

-- For gallery table
ALTER TABLE "gallery" 
  ALTER COLUMN "resort_id" DROP NOT NULL;

-- For testimonials table
ALTER TABLE "testimonials" 
  ALTER COLUMN "resort_id" DROP NOT NULL;

