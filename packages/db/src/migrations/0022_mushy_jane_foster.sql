CREATE TABLE "attractions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"subtitle" text NOT NULL,
	"link" text DEFAULT '#',
	"image" integer,
	"active" boolean DEFAULT true NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"distance" varchar(100),
	"created_at" timestamp (0) DEFAULT now(),
	"updated_at" timestamp (0) DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "attractions" ADD CONSTRAINT "attractions_image_images_id_fk" FOREIGN KEY ("image") REFERENCES "public"."images"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "attractions_order_idx" ON "attractions" USING btree ("order");--> statement-breakpoint
CREATE INDEX "attractions_active_idx" ON "attractions" USING btree ("active");