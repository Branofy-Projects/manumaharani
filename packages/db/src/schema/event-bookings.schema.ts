import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { Events } from "./events.schema";
import { offerBookingStatusEnum } from "./offer-bookings.schema";

export const EventBookings = pgTable("event_bookings", {
  created_at: timestamp("created_at").defaultNow().notNull(),
  email: text("email").notNull(),
  event_id: uuid("event_id").references(() => Events.id, { onDelete: "cascade" }).notNull(),
  id: uuid("id").primaryKey().defaultRandom(),
  message: text("message").notNull(),
  name: text("name").notNull(),
  number_of_guests: integer("number_of_guests").notNull().default(1),
  phone: text("phone").notNull(),
  status: offerBookingStatusEnum("status").notNull().default("pending"),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export type TNewEventBooking = typeof EventBookings.$inferInsert;
export type TEventBooking = typeof EventBookings.$inferSelect;

export const createEventBookingSchema = createInsertSchema(EventBookings);
export const selectEventBookingSchema = createSelectSchema(EventBookings);
