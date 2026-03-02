import { integer, pgEnum, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const reelStatusEnum = pgEnum("reel_status", ["active", "inactive"]);

export const Reels = pgTable("reels", {
  created_at: timestamp("created_at").notNull().defaultNow(),
  description: text("description").notNull(),
  id: serial("id").primaryKey(),
  order: integer("order").notNull().default(0),
  redirect_url: text("redirect_url").notNull(),
  status: reelStatusEnum("status").notNull().default("active"),
  title: text("title").notNull(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
  video_url: text("video_url").notNull(),
});

export type TReel = typeof Reels.$inferSelect;
export type TNewReel = typeof Reels.$inferInsert;

export const createReelSchema = createInsertSchema(Reels);
export const selectReelSchema = createSelectSchema(Reels);
