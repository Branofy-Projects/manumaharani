"use server";

import { and, count, eq, or } from "@repo/db";
import { db, RoomBookings } from "@repo/db";

import { safeDbQuery } from "./utils/db-error-handler";

import type { TNewRoomBooking } from "@repo/db/schema/room-bookings.schema";

type TGetRoomBookingsFilters = {
  limit?: number;
  page?: number;
  search?: string;
  status?: string;
};

export const getRoomBookings = async (filters: TGetRoomBookingsFilters = {}) => {
  if (!db || !process.env.DATABASE_URL) {
    return { roomBookings: [], total: 0 };
  }

  const conditions = [];

  if (filters.search) {
    conditions.push(
      or(
        eq(RoomBookings.name, filters.search),
        eq(RoomBookings.email, filters.search),
        eq(RoomBookings.phone, filters.search)
      )
    );
  }

  if (filters.status) {
    conditions.push(eq(RoomBookings.status, filters.status as "cancelled" | "closed" | "confirmed" | "contacted" | "pending"));
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const totalResult = await safeDbQuery(
    async () => {
      const result = await db
        .select({ count: count() })
        .from(RoomBookings)
        .where(where);
      return result[0]?.count ?? 0;
    },
    0,
    "room-bookings",
    "count query"
  );

  const total = typeof totalResult === "number" ? totalResult : 0;

  const page = Math.max(1, filters.page || 1);
  const limit = Math.max(1, filters.limit || 10);
  const offset = (page - 1) * limit;

  const roomBookings = await safeDbQuery(
    async () => {
      return await db.query.RoomBookings.findMany({
        limit,
        offset,
        orderBy: (bookings, { desc }) => [desc(bookings.created_at)],
        where,
        with: {
          room: true,
        },
      });
    },
    [],
    "room-bookings",
    "findMany query"
  );

  return {
    roomBookings: roomBookings || [],
    total,
  };
};

export const updateRoomBookingStatus = async (
  id: string,
  status: "cancelled" | "closed" | "confirmed" | "contacted" | "pending",
) => {
  try {
    if (!db) throw new Error("Database connection not available");

    const [updated] = await db
      .update(RoomBookings)
      .set({
        status,
        updated_at: new Date(),
      })
      .where(eq(RoomBookings.id, id))
      .returning();

    return updated;
  } catch (error) {
    console.error("Error updating room booking status:", error);
    throw error;
  }
};

export const createRoomBooking = async (data: {
  check_in_date: string;
  check_out_date: string;
  email: string;
  message: string;
  name: string;
  number_of_guests: number;
  number_of_rooms: number;
  phone: string;
  room_id: number;
}) => {
  if (!db) throw new Error("Database connection not available");

  const booking = await safeDbQuery(
    async () => {
      const [result] = await db
        .insert(RoomBookings)
        .values({
          check_in_date: data.check_in_date,
          check_out_date: data.check_out_date,
          email: data.email,
          message: data.message,
          name: data.name,
          number_of_guests: data.number_of_guests,
          number_of_rooms: data.number_of_rooms,
          phone: data.phone,
          room_id: data.room_id,
        } satisfies TNewRoomBooking)
        .returning();
      return result;
    },
    null,
    "room-bookings",
    "create room booking"
  );

  if (!booking) {
    throw new Error("Failed to create room booking");
  }

  return booking;
};
