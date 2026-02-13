import {
  index,
  integer,
  numeric,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { Amenities } from "./amenities.schema";
import { Images } from "./images.schema";
import { bedTypeEnum } from "./room-types.schema";

export const roomStatusEnum = pgEnum("room_status", [
  "available",
  "occupied",
  "maintenance",
  "blocked",
]);

export const Rooms = pgTable(
  "rooms",
  {
    id: serial("id").primaryKey(),

    // Basic info
    description: text("description"),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    title: varchar("title", { length: 255 }).notNull(),

    // Media
    image: integer("image").references(() => Images.id, { onDelete: "set null" }),
    video_url: text("video_url"),

    // Size & capacity
    bed_type: bedTypeEnum("bed_type").notNull().default("double"),
    max_occupancy: integer("max_occupancy").notNull().default(2),
    number_of_beds: integer("number_of_beds").notNull().default(1),
    size_sqft: integer("size_sqft").notNull().default(0),

    // Check-in / Check-out
    check_in_time: varchar("check_in_time", { length: 20 }), // e.g. "14:00"
    check_out_time: varchar("check_out_time", { length: 20 }), // e.g. "11:00"

    // Policies
    children_policy: text("children_policy"),
    extra_beds: text("extra_beds"),

    // Pricing
    base_price: numeric("base_price", { precision: 10, scale: 2 }).notNull().default("0"),
    peak_season_price: numeric("peak_season_price", { precision: 10, scale: 2 }),
    weekend_price: numeric("weekend_price", { precision: 10, scale: 2 }),

    // Reviews (can be updated via cron or manual)
    rating: numeric("rating", { precision: 2, scale: 1 }),
    review_count: integer("review_count").default(0),

    // Display & status
    is_featured: integer("is_featured").notNull().default(0),
    order: integer("order").notNull().default(0),
    status: roomStatusEnum("status").default("available"),

    // Optional identifiers
    floor: integer("floor"),
    notes: text("notes"),
    room_number: varchar("room_number", { length: 50 }),

    created_at: timestamp("created_at", { precision: 0 }).defaultNow(),
    updated_at: timestamp("updated_at", { precision: 0 })
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("rooms_slug_idx").on(table.slug),
    index("rooms_status_idx").on(table.status),
    index("rooms_is_featured_idx").on(table.is_featured),
    index("rooms_order_idx").on(table.order),
  ]
);

export const RoomImages = pgTable("room_images", {
  id: serial("id").primaryKey(),
  image_id: integer("image_id")
    .references(() => Images.id, { onDelete: "cascade" })
    .notNull(),
  order: integer("order").notNull().default(0),
  room_id: integer("room_id")
    .references(() => Rooms.id, { onDelete: "cascade" })
    .notNull(),
});

export const RoomAmenities = pgTable(
  "room_amenities",
  {
    amenity_id: integer("amenity_id")
      .references(() => Amenities.id, { onDelete: "cascade" })
      .notNull(),
    id: serial("id").primaryKey(),
    order: integer("order").notNull().default(0),
    room_id: integer("room_id")
      .references(() => Rooms.id, { onDelete: "cascade" })
      .notNull(),
  },
  (table) => [index("room_amenities_room_id_idx").on(table.room_id)]
);

export const insertRoomSchema = createInsertSchema(Rooms, {
  max_occupancy: (m) => m.min(1, "Max occupancy must be at least 1"),
  number_of_beds: (n) => n.min(0, "Number of beds must be 0 or greater"),
  size_sqft: (s) => s.min(0, "Size must be 0 or greater"),
  slug: (s) => s.min(1, "Slug is required").max(255),
  title: (t) => t.min(1, "Title is required").max(255),
});

export const selectRoomSchema = createSelectSchema(Rooms);

export type TBedType = (typeof bedTypeEnum.enumValues)[number];
export type TNewRoom = typeof Rooms.$inferInsert;
export type TNewRoomAmenity = typeof RoomAmenities.$inferInsert;
export type TNewRoomImage = typeof RoomImages.$inferInsert;
export type TRoomAmenityBase = typeof RoomAmenities.$inferSelect;
export type TRoomBase = typeof Rooms.$inferSelect;
export type TRoomImageBase = typeof RoomImages.$inferSelect;
export type TRoomStatus = (typeof roomStatusEnum.enumValues)[number];