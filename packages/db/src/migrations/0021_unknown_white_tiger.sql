CREATE TYPE "public"."reel_status" AS ENUM('active', 'inactive');--> statement-breakpoint
CREATE TABLE "reels" (
	"created_at" timestamp DEFAULT now() NOT NULL,
	"description" text NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"redirect_url" text NOT NULL,
	"status" "reel_status" DEFAULT 'active' NOT NULL,
	"title" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"video_url" text NOT NULL
);
