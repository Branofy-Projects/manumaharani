"use server";

import { and, count, eq, or } from "@repo/db";
import { db, EventBookings } from "@repo/db";

import { safeDbQuery } from "./utils/db-error-handler";

import type { TNewEventBooking } from "@repo/db/schema/event-bookings.schema";

type TGetEventBookingsFilters = {
  limit?: number;
  page?: number;
  search?: string;
  status?: string;
};

export const getEventBookings = async (filters: TGetEventBookingsFilters = {}) => {
  if (!db || !process.env.DATABASE_URL) {
    return { eventBookings: [], total: 0 };
  }

  const conditions = [];

  if (filters.search) {
    conditions.push(
      or(
        eq(EventBookings.name, filters.search),
        eq(EventBookings.email, filters.search),
        eq(EventBookings.phone, filters.search)
      )
    );
  }

  if (filters.status) {
    conditions.push(eq(EventBookings.status, filters.status as "cancelled" | "closed" | "confirmed" | "contacted" | "pending"));
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const totalResult = await safeDbQuery(
    async () => {
      const result = await db
        .select({ count: count() })
        .from(EventBookings)
        .where(where);
      return result[0]?.count ?? 0;
    },
    0,
    "event-bookings",
    "count query"
  );

  const total = typeof totalResult === "number" ? totalResult : 0;

  const page = Math.max(1, filters.page || 1);
  const limit = Math.max(1, filters.limit || 10);
  const offset = (page - 1) * limit;

  const eventBookings = await safeDbQuery(
    async () => {
      return await db.query.EventBookings.findMany({
        limit,
        offset,
        orderBy: (bookings, { desc }) => [desc(bookings.created_at)],
        where,
        with: {
          event: true,
        },
      });
    },
    [],
    "event-bookings",
    "findMany query"
  );

  return {
    eventBookings: eventBookings || [],
    total,
  };
};

export const updateEventBookingStatus = async (
  id: string,
  status: "cancelled" | "closed" | "confirmed" | "contacted" | "pending",
) => {
  try {
    if (!db) throw new Error("Database connection not available");

    const [updated] = await db
      .update(EventBookings)
      .set({
        status,
        updated_at: new Date(),
      })
      .where(eq(EventBookings.id, id))
      .returning();

    return updated;
  } catch (error) {
    console.error("Error updating event booking status:", error);
    throw error;
  }
};

export const createEventBooking = async (data: {
  email: string;
  message: string;
  name: string;
  number_of_guests: number;
  event_id: string;
  phone: string;
}) => {
  if (!db) throw new Error("Database connection not available");

  const booking = await safeDbQuery(
    async () => {
      const [result] = await db
        .insert(EventBookings)
        .values({
          email: data.email,
          event_id: data.event_id,
          message: data.message,
          name: data.name,
          number_of_guests: data.number_of_guests,
          phone: data.phone,
        } satisfies TNewEventBooking)
        .returning();
      return result;
    },
    null,
    "event-bookings",
    "create event booking"
  );

  if (!booking) {
    throw new Error("Failed to create event booking");
  }

  return booking;
};
