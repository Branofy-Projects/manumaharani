import { date, integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { Attractions } from "./attractions.schema";
import { offerBookingStatusEnum } from "./offer-bookings.schema";

export const AttractionBookings = pgTable("attraction_bookings", {
  attraction_id: uuid("attraction_id").references(() => Attractions.id, { onDelete: "cascade" }).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  email: text("email").notNull(),
  id: uuid("id").primaryKey().defaultRandom(),
  message: text("message").notNull(),
  name: text("name").notNull(),
  number_of_guests: integer("number_of_guests").notNull().default(1),
  phone: text("phone").notNull(),
  status: offerBookingStatusEnum("ab_status").notNull().default("pending"),
  travel_date: date("travel_date").notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export type TNewAttractionBooking = typeof AttractionBookings.$inferInsert;
export type TAttractionBooking = typeof AttractionBookings.$inferSelect;

export const createAttractionBookingSchema = createInsertSchema(AttractionBookings);
export const selectAttractionBookingSchema = createSelectSchema(AttractionBookings);
