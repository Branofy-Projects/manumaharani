import { date, integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { offerBookingStatusEnum } from "./offer-bookings.schema";
import { Rooms } from "./rooms.schema";

export const RoomBookings = pgTable("room_bookings", {
  check_in_date: date("check_in_date").notNull(),
  check_out_date: date("check_out_date").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  email: text("email").notNull(),
  id: uuid("id").primaryKey().defaultRandom(),
  message: text("message").notNull(),
  name: text("name").notNull(),
  number_of_guests: integer("number_of_guests").notNull().default(1),
  number_of_rooms: integer("number_of_rooms").notNull().default(1),
  phone: text("phone").notNull(),
  room_id: integer("room_id")
    .references(() => Rooms.id, { onDelete: "cascade" })
    .notNull(),
  status: offerBookingStatusEnum("status").notNull().default("pending"),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export type TNewRoomBooking = typeof RoomBookings.$inferInsert;
export type TRoomBooking = typeof RoomBookings.$inferSelect;

export const createRoomBookingSchema = createInsertSchema(RoomBookings);
export const selectRoomBookingSchema = createSelectSchema(RoomBookings);
