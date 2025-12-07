-- COPY AND PASTE THIS INTO YOUR DATABASE SQL EDITOR AND RUN IT
-- This will fix the resort_id error immediately

ALTER TABLE "room_types" ALTER COLUMN "resort_id" DROP NOT NULL;
ALTER TABLE "rooms" ALTER COLUMN "resort_id" DROP NOT NULL;
ALTER TABLE "gallery" ALTER COLUMN "resort_id" DROP NOT NULL;
ALTER TABLE "testimonials" ALTER COLUMN "resort_id" DROP NOT NULL;

