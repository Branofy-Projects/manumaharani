-- Remove NOT NULL constraints from resort_id columns
-- This allows the application to work without requiring resort_id

ALTER TABLE "room_types" 
  ALTER COLUMN "resort_id" DROP NOT NULL;

ALTER TABLE "rooms" 
  ALTER COLUMN "resort_id" DROP NOT NULL;

ALTER TABLE "gallery" 
  ALTER COLUMN "resort_id" DROP NOT NULL;

ALTER TABLE "testimonials" 
  ALTER COLUMN "resort_id" DROP NOT NULL;

