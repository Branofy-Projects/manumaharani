import {
    index, integer, pgEnum, pgTable, serial, text, timestamp, varchar
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

import { Images } from './images.schema';
import { RoomTypes } from './room-types.schema';

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
    room_type_id: integer("room_type_id")
      .references(() => RoomTypes.id, { onDelete: "cascade" })
      .notNull(),

    description: text("description"),
    title: varchar("title", { length: 255 }).notNull(),

    floor: integer("floor").notNull(),
    room_number: varchar("room_number", { length: 50 }).notNull().unique(),
    status: roomStatusEnum("status").default("available"),

    notes: text("notes"),

    created_at: timestamp("created_at", { precision: 0 }).defaultNow(),
    updated_at: timestamp("updated_at", { precision: 0 })
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("rooms_room_number_idx").on(table.room_number),
    index("rooms_room_type_id_idx").on(table.room_type_id),
    index("rooms_status_idx").on(table.status),
    index("rooms_floor_idx").on(table.floor),
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

export const insertRoomSchema = createInsertSchema(Rooms, {
  floor: (floor) => floor.min(0, "Floor must be 0 or greater"),
  room_number: (room_number) =>
    room_number.min(1, "Room number is required").max(50),
  title: (title) => title.min(1, "Title is required").max(255),
});

export const selectRoomSchema = createSelectSchema(Rooms);

export type TNewRoom = typeof Rooms.$inferInsert;
export type TNewRoomImage = typeof RoomImages.$inferInsert;
export type TRoomBase = typeof Rooms.$inferSelect;
export type TRoomImageBase = typeof RoomImages.$inferSelect;
export type TRoomStatus = (typeof roomStatusEnum.enumValues)[number];
