import {
  boolean,
  date,
  index,
  integer,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { Faqs } from "./faqs.schema";
import { Images } from "./images.schema";
import { highlightTypeEnum, offerCategoryEnum, offerStatusEnum } from "./offers.schema";

// Main Events Table
export const Events = pgTable(
  "events",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    // Basic Info
    category: offerCategoryEnum("category").notNull().default("experience"),
    description: text("description").notNull(),
    excerpt: text("excerpt").notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),

    // Status
    active: boolean("active").notNull().default(false),
    status: offerStatusEnum("status").notNull().default("draft"),

    // Media
    image: integer("image").references(() => Images.id, { onDelete: "set null" }),

    // Pricing
    discounted_price: numeric("discounted_price", { precision: 10, scale: 2 }),
    original_price: numeric("original_price", { precision: 10, scale: 2 }),
    price_per: varchar("price_per", { length: 50 }).default("person"),

    // Details
    duration: varchar("duration", { length: 100 }),
    location: varchar("location", { length: 255 }),
    meeting_point: text("meeting_point"),
    meeting_point_details: text("meeting_point_details"),

    // Capacity & Availability
    languages: text("languages"),
    max_group_size: integer("max_group_size"),
    min_group_size: integer("min_group_size").default(1),

    // Booking
    booking_notice: text("booking_notice"),
    link: text("link").notNull(),

    // Cancellation
    cancellation_deadline: varchar("cancellation_deadline", { length: 100 }),
    cancellation_policy: text("cancellation_policy"),
    free_cancellation: boolean("free_cancellation").default(false),

    // Reviews
    rating: numeric("rating", { precision: 2, scale: 1 }),
    review_count: integer("review_count").default(0),

    // SEO & Meta
    meta_description: text("meta_description"),
    meta_title: varchar("meta_title", { length: 255 }),

    // Timestamps
    created_at: timestamp("created_at", { precision: 0 }).defaultNow(),
    updated_at: timestamp("updated_at", { precision: 0 })
      .defaultNow()
      .$onUpdate(() => new Date()),

    // Event Date & Time (instead of valid_from/valid_until)
    endDate: date("end_date"),
    endTime: varchar("end_time", { length: 10 }).notNull().default("16:00"),
    startDate: date("start_date").notNull(),
    startTime: varchar("start_time", { length: 10 }).notNull().default("08:00"),
  },
  (table) => [
    index("events_name_idx").on(table.name),
    index("events_slug_idx").on(table.slug),
    index("events_category_idx").on(table.category),
    index("events_status_idx").on(table.status),
    index("events_active_idx").on(table.active),
    index("events_start_date_idx").on(table.startDate),
    index("events_end_date_idx").on(table.endDate),
    index("events_start_date_end_date_idx").on(table.startDate, table.endDate),
    index("events_location_idx").on(table.location),
  ]
);

// Event Images (Gallery)
export const EventImages = pgTable("event_images", {
  caption: text("caption"),
  event_id: uuid("event_id")
    .references(() => Events.id, { onDelete: "cascade" })
    .notNull(),
  id: serial("id").primaryKey(),
  image_id: integer("image_id")
    .references(() => Images.id, { onDelete: "cascade" })
    .notNull(),
  order: integer("order").notNull().default(0),
});

// Event Highlights (What's Included/Excluded)
export const EventHighlights = pgTable(
  "event_highlights",
  {
    event_id: uuid("event_id")
      .references(() => Events.id, { onDelete: "cascade" })
      .notNull(),
    id: serial("id").primaryKey(),
    order: integer("order").notNull().default(0),
    text: text("text").notNull(),
    type: highlightTypeEnum("type").notNull().default("included"),
  },
  (table) => [index("event_highlights_type_idx").on(table.type)]
);

// Event Itinerary (What to Expect - Timeline)
export const EventItinerary = pgTable("event_itinerary", {
  admission_included: boolean("admission_included").default(false),
  description: text("description"),
  duration: varchar("duration", { length: 100 }),
  event_id: uuid("event_id")
    .references(() => Events.id, { onDelete: "cascade" })
    .notNull(),
  id: serial("id").primaryKey(),
  is_stop: boolean("is_stop").default(true),
  location: varchar("location", { length: 255 }),
  order: integer("order").notNull().default(0),
  title: varchar("title", { length: 255 }).notNull(),
});

// Event FAQs (Junction Table)
export const EventFaqs = pgTable("event_faqs", {
  event_id: uuid("event_id")
    .references(() => Events.id, { onDelete: "cascade" })
    .notNull(),
  faq_id: integer("faq_id")
    .references(() => Faqs.id, { onDelete: "cascade" })
    .notNull(),
  id: serial("id").primaryKey(),
  order: integer("order").notNull().default(0),
});

// Zod Schemas
export const insertEventSchema = createInsertSchema(Events, {
  name: (name) => name.min(1, "Event name is required").max(255),
  slug: (slug) => slug.min(1, "Slug is required").max(255),
});
export const selectEventSchema = createSelectSchema(Events);

// Base Types
export type TEventBase = typeof Events.$inferSelect;
export type TEventFaqBase = typeof EventFaqs.$inferSelect;
export type TEventHighlightBase = typeof EventHighlights.$inferSelect;
export type TEventImageBase = typeof EventImages.$inferSelect;
export type TEventItineraryBase = typeof EventItinerary.$inferSelect;

export type TNewEvent = typeof Events.$inferInsert;
export type TNewEventFaq = typeof EventFaqs.$inferInsert;
export type TNewEventHighlight = typeof EventHighlights.$inferInsert;
export type TNewEventImage = typeof EventImages.$inferInsert;
export type TNewEventItinerary = typeof EventItinerary.$inferInsert;
