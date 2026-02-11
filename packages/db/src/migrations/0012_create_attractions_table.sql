-- Create attractions table (used by "Nearby Attractions" in the app)
-- Run this in your DB SQL editor if the table doesn't exist.

CREATE TABLE IF NOT EXISTS "attractions" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "title" varchar(255) NOT NULL,
  "subtitle" text NOT NULL,
  "link" text DEFAULT '#',
  "image" integer REFERENCES "images"("id") ON DELETE SET NULL,
  "active" boolean NOT NULL DEFAULT true,
  "order" integer NOT NULL DEFAULT 0,
  "distance" varchar(100),
  "created_at" timestamp(0) DEFAULT now(),
  "updated_at" timestamp(0) DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "attractions_order_idx" ON "attractions" ("order");
CREATE INDEX IF NOT EXISTS "attractions_active_idx" ON "attractions" ("active");
