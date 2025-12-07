-- Fix resort_id columns in room_types and rooms tables
-- Make resort_id nullable and remove NOT NULL constraint

-- For room_types table
ALTER TABLE "room_types" 
  ALTER COLUMN "resort_id" DROP NOT NULL;

-- For rooms table (if it still has resort_id)
ALTER TABLE "rooms" 
  ALTER COLUMN "resort_id" DROP NOT NULL;

-- Optional: Drop the foreign key constraints if you want to completely remove the relationship
-- ALTER TABLE "room_types" DROP CONSTRAINT IF EXISTS "room_types_resort_id_resort_id_fk";
-- ALTER TABLE "rooms" DROP CONSTRAINT IF EXISTS "rooms_resort_id_resort_id_fk";

-- Optional: Drop the columns entirely (uncomment if you want to remove them completely)
-- ALTER TABLE "room_types" DROP COLUMN IF EXISTS "resort_id";
-- ALTER TABLE "rooms" DROP COLUMN IF EXISTS "resort_id";

