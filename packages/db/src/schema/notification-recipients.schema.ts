import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const NotificationRecipients = pgTable("notification_recipients", {
  id: uuid("id").primaryKey().defaultRandom(),

  email: text("email").notNull(),
  name: text("name").notNull(),
  phone: text("phone"),

  is_active: boolean("is_active").notNull().default(true),

  notify_attraction_bookings: boolean("notify_attraction_bookings").notNull().default(true),
  notify_bookings: boolean("notify_bookings").notNull().default(true),
  notify_contact_queries: boolean("notify_contact_queries").notNull().default(true),
  notify_event_bookings: boolean("notify_event_bookings").notNull().default(true),
  notify_offer_bookings: boolean("notify_offer_bookings").notNull().default(true),
  notify_room_bookings: boolean("notify_room_bookings").notNull().default(true),

  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export type TNewNotificationRecipient = typeof NotificationRecipients.$inferInsert;
export type TNotificationRecipient = typeof NotificationRecipients.$inferSelect;

export const insertNotificationRecipientSchema = createInsertSchema(NotificationRecipients);
export const selectNotificationRecipientSchema = createSelectSchema(NotificationRecipients);
