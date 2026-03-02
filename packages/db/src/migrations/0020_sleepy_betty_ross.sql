ALTER TABLE "blogs" DROP CONSTRAINT "blogs_author_id_user_id_fk";
--> statement-breakpoint
DROP INDEX "blogs_author_id_idx";--> statement-breakpoint
ALTER TABLE "blogs" DROP COLUMN "author_id";--> statement-breakpoint
ALTER TABLE "blogs" DROP COLUMN "author_name";