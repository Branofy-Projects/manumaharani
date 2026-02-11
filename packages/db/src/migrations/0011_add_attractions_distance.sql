-- Add distance column to attractions (nullable, e.g. "2.5 km", "10 min drive")
ALTER TABLE "attractions" ADD COLUMN IF NOT EXISTS "distance" varchar(100);
