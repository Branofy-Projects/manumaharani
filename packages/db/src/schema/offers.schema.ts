import {
  boolean,
  index,
  integer,
  numeric,
  pgEnum,
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

// Enums
export const offerCategoryEnum = pgEnum("offer_category", [
  "experience",
  "package",
  "dining",
  "spa",
  "adventure",
  "cultural",
  "romantic",
  "family",
]);

export const offerStatusEnum = pgEnum("offer_status", ["draft", "active", "expired", "archived"]);

export const highlightTypeEnum = pgEnum("highlight_type", ["included", "excluded"]);

// Main Offers Table
export const Offers = pgTable(
  "offers",
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
    price_per: varchar("price_per", { length: 50 }).default("person"), // person, couple, group, night

    // Details
    duration: varchar("duration", { length: 100 }), // e.g., "8 hours", "3 days", "Full Day"
    location: varchar("location", { length: 255 }),
    meeting_point: text("meeting_point"),
    meeting_point_details: text("meeting_point_details"),

    // Capacity & Availability
    languages: text("languages"), // JSON array of languages
    max_group_size: integer("max_group_size"),
    min_group_size: integer("min_group_size").default(1),

    // Booking
    booking_notice: text("booking_notice"), // e.g., "Book 24 hours in advance"
    link: text("link").notNull(),

    // Cancellation
    cancellation_deadline: varchar("cancellation_deadline", { length: 100 }), // e.g., "24 hours before"
    cancellation_policy: text("cancellation_policy"),
    free_cancellation: boolean("free_cancellation").default(false),

    // Reviews (can be updated via cron/trigger)
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

    // Validity
    valid_from: timestamp("valid_from", { precision: 0 }),
    valid_until: timestamp("valid_until", { precision: 0 }),
  },
  (table) => [
    index("offers_name_idx").on(table.name),
    index("offers_slug_idx").on(table.slug),
    index("offers_category_idx").on(table.category),
    index("offers_status_idx").on(table.status),
    index("offers_active_idx").on(table.active),
  ]
);

// Offer Images (Gallery)
export const OfferImages = pgTable("offer_images", {
  caption: text("caption"),
  id: serial("id").primaryKey(),
  image_id: integer("image_id")
    .references(() => Images.id, { onDelete: "cascade" })
    .notNull(),
  offer_id: uuid("offer_id")
    .references(() => Offers.id, { onDelete: "cascade" })
    .notNull(),
  order: integer("order").notNull().default(0),
});

// Offer Highlights (What's Included/Excluded)
export const OfferHighlights = pgTable(
  "offer_highlights",
  {
    id: serial("id").primaryKey(),
    offer_id: uuid("offer_id")
      .references(() => Offers.id, { onDelete: "cascade" })
      .notNull(),
    order: integer("order").notNull().default(0),
    text: text("text").notNull(),
    type: highlightTypeEnum("type").notNull().default("included"),
  },
  (table) => [index("offer_highlights_type_idx").on(table.type)]
);

// Offer Itinerary (What to Expect - Timeline)
export const OfferItinerary = pgTable("offer_itinerary", {
  admission_included: boolean("admission_included").default(false),
  description: text("description"),
  duration: varchar("duration", { length: 100 }), // e.g., "30 minutes"
  id: serial("id").primaryKey(),
  is_stop: boolean("is_stop").default(true), // true for stops, false for pass-by
  location: varchar("location", { length: 255 }),
  offer_id: uuid("offer_id")
    .references(() => Offers.id, { onDelete: "cascade" })
    .notNull(),
  order: integer("order").notNull().default(0),
  title: varchar("title", { length: 255 }).notNull(),
});

// Offer FAQs (Junction Table)
export const OfferFaqs = pgTable("offer_faqs", {
  faq_id: integer("faq_id")
    .references(() => Faqs.id, { onDelete: "cascade" })
    .notNull(),
  id: serial("id").primaryKey(),
  offer_id: uuid("offer_id")
    .references(() => Offers.id, { onDelete: "cascade" })
    .notNull(),
  order: integer("order").notNull().default(0),
});

// Zod Schemas
export const insertOfferSchema = createInsertSchema(Offers, {
  name: (name) => name.min(1, "Offer name is required").max(255),
  slug: (slug) => slug.min(1, "Slug is required").max(255),
});
export const selectOfferSchema = createSelectSchema(Offers);

export type THighlightType = (typeof highlightTypeEnum.enumValues)[number];
export type TNewOffer = typeof Offers.$inferInsert;

export type TNewOfferFaq = typeof OfferFaqs.$inferInsert;
export type TNewOfferHighlight = typeof OfferHighlights.$inferInsert;

export type TNewOfferImage = typeof OfferImages.$inferInsert;
export type TNewOfferItinerary = typeof OfferItinerary.$inferInsert;

// Types
export type TOfferBase = typeof Offers.$inferSelect;
export type TOfferCategory = (typeof offerCategoryEnum.enumValues)[number];

export type TOfferFaqBase = typeof OfferFaqs.$inferSelect;
export type TOfferHighlightBase = typeof OfferHighlights.$inferSelect;

export type TOfferImageBase = typeof OfferImages.$inferSelect;
export type TOfferItineraryBase = typeof OfferItinerary.$inferSelect;
export type TOfferStatus = (typeof offerStatusEnum.enumValues)[number];