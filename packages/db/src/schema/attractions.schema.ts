import {
  boolean,
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { Images } from "./images.schema";

// Main Attractions Table
export const Attractions = pgTable(
  "attractions",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    // Content
    description: text("description"),
    link: text("link").default("#"),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    subtitle: text("subtitle").notNull(),
    title: varchar("title", { length: 255 }).notNull(),

    // Media
    image: integer("image").references(() => Images.id, { onDelete: "set null" }),

    // Display
    active: boolean("active").notNull().default(true),
    distance: varchar("distance", { length: 100 }),
    order: integer("order").notNull().default(0),

    close_time: varchar("close_time", { length: 20 }),
    faq: text("faq"),
    open_time: varchar("open_time", { length: 20 }),
    
    // Timestamps
    created_at: timestamp("created_at", { precision: 0 }).defaultNow(),
    updated_at: timestamp("updated_at", { precision: 0 })
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("attractions_order_idx").on(table.order),
    index("attractions_active_idx").on(table.active),
    index("attractions_slug_idx").on(table.slug),
  ]
);

// Attraction Images Junction Table (gallery)
export const AttractionImages = pgTable("attraction_images", {
  attraction_id: uuid("attraction_id")
    .references(() => Attractions.id, { onDelete: "cascade" })
    .notNull(),
  id: serial("id").primaryKey(),
  image_id: integer("image_id")
    .references(() => Images.id, { onDelete: "cascade" })
    .notNull(),
  order: integer("order").notNull().default(0),
});

// Zod Schemas
export const insertAttractionSchema = createInsertSchema(Attractions, {
  subtitle: (subtitle) => subtitle.min(1, "Subtitle is required"),
  title: (title) => title.min(1, "Attraction title is required").max(255),
});

export const selectAttractionSchema = createSelectSchema(Attractions);

// Types
export type TAttractionBase = typeof Attractions.$inferSelect;
export type TAttractionImageBase = typeof AttractionImages.$inferSelect;
export type TNewAttraction = typeof Attractions.$inferInsert;
