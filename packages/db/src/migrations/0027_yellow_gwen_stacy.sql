CREATE TABLE "attraction_images" (
	"attraction_id" uuid NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"image_id" integer NOT NULL,
	"order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "gallery" ALTER COLUMN "category" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "gallery" ALTER COLUMN "category" SET DEFAULT 'overview'::text;--> statement-breakpoint
DROP TYPE "public"."gallery_category";--> statement-breakpoint
CREATE TYPE "public"."gallery_category" AS ENUM('room', 'overview', 'dining', 'wedding');--> statement-breakpoint
ALTER TABLE "gallery" ALTER COLUMN "category" SET DEFAULT 'overview'::"public"."gallery_category";--> statement-breakpoint
ALTER TABLE "gallery" ALTER COLUMN "category" SET DATA TYPE "public"."gallery_category" USING "category"::"public"."gallery_category";--> statement-breakpoint
ALTER TABLE "attraction_images" ADD CONSTRAINT "attraction_images_attraction_id_attractions_id_fk" FOREIGN KEY ("attraction_id") REFERENCES "public"."attractions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attraction_images" ADD CONSTRAINT "attraction_images_image_id_images_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."images"("id") ON DELETE cascade ON UPDATE no action;