import {
  boolean,
  index,
  integer,
  pgTable,
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
    title: varchar("title", { length: 255 }).notNull(),
    subtitle: text("subtitle").notNull(),
    link: text("link").default("#"),

    // Media
    image: integer("image").references(() => Images.id, { onDelete: "set null" }),

    // Display
    active: boolean("active").notNull().default(true),
    order: integer("order").notNull().default(0),
    distance: varchar("distance", { length: 100 }),

    // Timestamps
    created_at: timestamp("created_at", { precision: 0 }).defaultNow(),
    updated_at: timestamp("updated_at", { precision: 0 })
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("attractions_order_idx").on(table.order),
    index("attractions_active_idx").on(table.active),
  ]
);

// Zod Schemas
export const insertAttractionSchema = createInsertSchema(Attractions, {
  title: (title) => title.min(1, "Attraction title is required").max(255),
  subtitle: (subtitle) => subtitle.min(1, "Subtitle is required"),
});
export const selectAttractionSchema = createSelectSchema(Attractions);

// Types
export type TAttractionBase = typeof Attractions.$inferSelect;
export type TNewAttraction = typeof Attractions.$inferInsert;
