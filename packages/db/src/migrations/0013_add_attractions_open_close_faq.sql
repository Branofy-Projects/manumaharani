-- Add open_time, close_time, and faq to attractions
ALTER TABLE "attractions" ADD COLUMN IF NOT EXISTS "open_time" varchar(20);
ALTER TABLE "attractions" ADD COLUMN IF NOT EXISTS "close_time" varchar(20);
ALTER TABLE "attractions" ADD COLUMN IF NOT EXISTS "faq" text;
