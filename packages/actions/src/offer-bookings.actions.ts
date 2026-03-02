"use server";

import { and, count, eq, or } from "@repo/db";
import { db, OfferBookings } from "@repo/db";

import { safeDbQuery } from "./utils/db-error-handler";

import type { TNewOfferBooking } from "@repo/db/schema/offer-bookings.schema";

type TGetOfferBookingsFilters = {
  limit?: number;
  page?: number;
  search?: string;
  status?: string;
};

export const getOfferBookings = async (filters: TGetOfferBookingsFilters = {}) => {
  if (!db || !process.env.DATABASE_URL) {
    return { offerBookings: [], total: 0 };
  }

  const conditions = [];

  if (filters.search) {
    conditions.push(
      or(
        eq(OfferBookings.name, filters.search),
        eq(OfferBookings.email, filters.search),
        eq(OfferBookings.phone, filters.search)
      )
    );
  }

  if (filters.status) {
    conditions.push(eq(OfferBookings.status, filters.status as any));
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const totalResult = await safeDbQuery(
    async () => {
      const result = await db
        .select({ count: count() })
        .from(OfferBookings)
        .where(where);
      return result[0]?.count ?? 0;
    },
    0,
    "offer-bookings",
    "count query"
  );

  const total = typeof totalResult === "number" ? totalResult : 0;

  const page = Math.max(1, filters.page || 1);
  const limit = Math.max(1, filters.limit || 10);
  const offset = (page - 1) * limit;

  const offerBookings = await safeDbQuery(
    async () => {
      return await db.query.OfferBookings.findMany({
        limit,
        offset,
        orderBy: (bookings, { desc }) => [desc(bookings.created_at)],
        where,
        with: {
          offer: true,
        },
      });
    },
    [],
    "offer-bookings",
    "findMany query"
  );

  return {
    offerBookings: offerBookings || [],
    total,
  };
};

export const updateOfferBookingStatus = async (
  id: string,
  status: "cancelled" | "closed" | "confirmed" | "contacted" | "pending",
) => {
  try {
    if (!db) throw new Error("Database connection not available");

    const [updated] = await db
      .update(OfferBookings)
      .set({
        status,
        updated_at: new Date(),
      })
      .where(eq(OfferBookings.id, id))
      .returning();

    return updated;
  } catch (error) {
    console.error("Error updating offer booking status:", error);
    throw error;
  }
};

export const createOfferBooking = async (data: {
  email: string;
  message: string;
  name: string;
  number_of_guests: number;
  offer_id: string;
  phone: string;
  travel_date: string;
}) => {
  if (!db) throw new Error("Database connection not available");

  const booking = await safeDbQuery(
    async () => {
      const [result] = await db
        .insert(OfferBookings)
        .values({
          email: data.email,
          message: data.message,
          name: data.name,
          number_of_guests: data.number_of_guests,
          offer_id: data.offer_id,
          phone: data.phone,
          travel_date: data.travel_date,
        } satisfies TNewOfferBooking)
        .returning();
      return result;
    },
    null,
    "offer-bookings",
    "create offer booking"
  );

  if (!booking) {
    throw new Error("Failed to create booking");
  }

  return booking;
};
