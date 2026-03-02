CREATE TYPE "public"."offer_booking_status" AS ENUM('pending', 'contacted', 'confirmed', 'cancelled', 'closed');--> statement-breakpoint
ALTER TABLE "experiences" ADD COLUMN "order" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "offer_bookings" ADD COLUMN "status" "offer_booking_status" DEFAULT 'pending' NOT NULL;