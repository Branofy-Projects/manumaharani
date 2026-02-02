import { date, index, integer, pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";

import { Images } from "./images.schema";

export const Events = pgTable("events", {
  description: text("description").notNull(),
  endDate: date("end_date"),
  endTime: varchar("end_time", { length: 10 }).notNull().default("16:00"),
  excerpt: text("excerpt").notNull(),
  id: uuid("id").primaryKey().defaultRandom(),
  image: integer("image").references(() => Images.id, {
    onDelete: "set null",
  }),
  location: text("location").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  startDate: date("start_date").notNull(),
  startTime: varchar("start_time", { length: 10 }).notNull().default("08:00"),
}, (table) => [
  index("events_name_idx").on(table.name),
  index("events_start_date_idx").on(table.startDate),
  index("events_end_date_idx").on(table.endDate),
  index("events_start_date_end_date_idx").on(table.startDate, table.endDate),
  index("events_location_idx").on(table.location),
]);

export type TEventBaser = typeof Events.$inferSelect;
export type TNewEvent = typeof Events.$inferInsert;