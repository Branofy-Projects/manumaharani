import { date, integer, pgEnum,pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { Offers } from "./offers.schema";

export const offerBookingStatusEnum = pgEnum("offer_booking_status", ["pending", "contacted",  "confirmed","cancelled", "closed"]);

export const OfferBookings = pgTable("offer_bookings", {
  created_at: timestamp("created_at").defaultNow().notNull(),
  email: text("email").notNull(),
  id: uuid("id").primaryKey().defaultRandom(),
  message: text("message").notNull(),
  name: text("name").notNull(),
  number_of_guests: integer("number_of_guests").notNull().default(1),
  offer_id: uuid("offer_id").references(() => Offers.id, { onDelete: "cascade" }).notNull(),
  phone: text("phone").notNull(),
  status: offerBookingStatusEnum("status").notNull().default("pending"),
  travel_date: date("travel_date").notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});


export type TNewOfferBooking = typeof OfferBookings.$inferInsert;
export type TOfferBooking = typeof OfferBookings.$inferSelect;

export const createOfferBookingSchema = createInsertSchema(OfferBookings);
export const selectOfferBookingSchema = createSelectSchema(OfferBookings);