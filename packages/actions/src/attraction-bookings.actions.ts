"use server";

import { and, count, eq, or } from "@repo/db";
import { AttractionBookings, db } from "@repo/db";

import { safeDbQuery } from "./utils/db-error-handler";

import type { TNewAttractionBooking } from "@repo/db/schema/attraction-bookings.schema";

type TGetAttractionBookingsFilters = {
  limit?: number;
  page?: number;
  search?: string;
  status?: string;
};

export const getAttractionBookings = async (filters: TGetAttractionBookingsFilters = {}) => {
  if (!db || !process.env.DATABASE_URL) {
    return { attractionBookings: [], total: 0 };
  }

  const conditions = [];

  if (filters.search) {
    conditions.push(
      or(
        eq(AttractionBookings.name, filters.search),
        eq(AttractionBookings.email, filters.search),
        eq(AttractionBookings.phone, filters.search)
      )
    );
  }

  if (filters.status) {
    conditions.push(eq(AttractionBookings.status, filters.status as any));
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const totalResult = await safeDbQuery(
    async () => {
      const result = await db
        .select({ count: count() })
        .from(AttractionBookings)
        .where(where);
      return result[0]?.count ?? 0;
    },
    0,
    "attraction-bookings",
    "count query"
  );

  const total = typeof totalResult === "number" ? totalResult : 0;

  const page = Math.max(1, filters.page || 1);
  const limit = Math.max(1, filters.limit || 10);
  const offset = (page - 1) * limit;

  const attractionBookings = await safeDbQuery(
    async () => {
      return await db.query.AttractionBookings.findMany({
        limit,
        offset,
        orderBy: (bookings, { desc }) => [desc(bookings.created_at)],
        where,
        with: {
          attraction: true,
        },
      });
    },
    [],
    "attraction-bookings",
    "findMany query"
  );

  return {
    attractionBookings: attractionBookings || [],
    total,
  };
};

export const updateAttractionBookingStatus = async (
  id: string,
  status: "cancelled" | "closed" | "confirmed" | "contacted" | "pending",
) => {
  try {
    if (!db) throw new Error("Database connection not available");

    const [updated] = await db
      .update(AttractionBookings)
      .set({
        status,
        updated_at: new Date(),
      })
      .where(eq(AttractionBookings.id, id))
      .returning();

    return updated;
  } catch (error) {
    console.error("Error updating attraction booking status:", error);
    throw error;
  }
};

export const createAttractionBooking = async (data: {
  attraction_id: string;
  email: string;
  message: string;
  name: string;
  number_of_guests: number;
  phone: string;
  travel_date: string;
}) => {
  if (!db) throw new Error("Database connection not available");

  const booking = await safeDbQuery(
    async () => {
      const [result] = await db
        .insert(AttractionBookings)
        .values({
          attraction_id: data.attraction_id,
          email: data.email,
          message: data.message,
          name: data.name,
          number_of_guests: data.number_of_guests,
          phone: data.phone,
          travel_date: data.travel_date,
        } satisfies TNewAttractionBooking)
        .returning();
      return result;
    },
    null,
    "attraction-bookings",
    "create attraction booking"
  );

  if (!booking) {
    throw new Error("Failed to create booking");
  }

  return booking;
};
