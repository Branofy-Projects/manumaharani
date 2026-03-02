CREATE TABLE "notification_recipients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"name" text NOT NULL,
	"phone" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"notify_attraction_bookings" boolean DEFAULT true NOT NULL,
	"notify_bookings" boolean DEFAULT true NOT NULL,
	"notify_contact_queries" boolean DEFAULT true NOT NULL,
	"notify_event_bookings" boolean DEFAULT true NOT NULL,
	"notify_offer_bookings" boolean DEFAULT true NOT NULL,
	"notify_room_bookings" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
