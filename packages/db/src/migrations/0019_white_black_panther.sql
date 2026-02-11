CREATE TYPE "public"."contact_query_status" AS ENUM('pending', 'contacted', 'resolved', 'closed');--> statement-breakpoint
CREATE TABLE "contact_queries" (
	"created_at" timestamp DEFAULT now() NOT NULL,
	"email" text NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"message" text NOT NULL,
	"name" text NOT NULL,
	"phone" text NOT NULL,
	"status" "contact_query_status" DEFAULT 'pending' NOT NULL,
	"subject" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
