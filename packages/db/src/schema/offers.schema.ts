import { boolean, index, integer, pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";

import { Images } from "./images.schema";

export const Offers = pgTable("offers", {
  active: boolean("active").notNull().default(false),
  description: text("description").notNull(),
  excerpt: text("excerpt").notNull(),
  id: uuid("id").primaryKey().defaultRandom(),
  image: integer("image").references(() => Images.id, {
    onDelete: "set null",
  }),
  link: text("link").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
}, (table) => [
  index("offers_name_idx").on(table.name),
]);

export type TNewOffer = typeof Offers.$inferInsert;
export type TOfferBase = typeof Offers.$inferSelect;