import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const contactQueryStatusEnum = pgEnum("contact_query_status", ["pending", "contacted", "resolved", "closed"]);

export const ContactQueries = pgTable("contact_queries", {
  created_at: timestamp("created_at").defaultNow().notNull(),
  email: text("email").notNull(),
  id: uuid("id").primaryKey().defaultRandom(),
  message: text("message").notNull(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  status: contactQueryStatusEnum("status").notNull().default("pending"),
  subject: text("subject").notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export type TNewContactQuery = typeof ContactQueries.$inferInsert;
export type TContactQuery = typeof ContactQueries.$inferSelect;

export const createContactQuerySchema = createInsertSchema(ContactQueries);
export const selectContactQuerySchema = createSelectSchema(ContactQueries);
