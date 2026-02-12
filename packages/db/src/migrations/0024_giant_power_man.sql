CREATE TABLE "event_bookings" (
	"created_at" timestamp DEFAULT now() NOT NULL,
	"email" text NOT NULL,
	"event_id" uuid NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"message" text NOT NULL,
	"name" text NOT NULL,
	"number_of_guests" integer DEFAULT 1 NOT NULL,
	"phone" text NOT NULL,
	"status" "offer_booking_status" DEFAULT 'pending' NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "event_bookings" ADD CONSTRAINT "event_bookings_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;