import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const Experiences = pgTable("experiences", {
  alt: text("alt"),
  created_at: timestamp("created_at").notNull().defaultNow(),
  id: serial("id").primaryKey(),
  image: text("image").notNull(),
  name: text("name").notNull(),
  order: integer("order").notNull().default(0),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
  url: text("url").notNull(),
});

export type TExperience = typeof Experiences.$inferSelect;
export type TNewExperience = typeof Experiences.$inferInsert;

export const createExperienceSchema = createInsertSchema(Experiences);
export const selectExperienceSchema = createSelectSchema(Experiences);