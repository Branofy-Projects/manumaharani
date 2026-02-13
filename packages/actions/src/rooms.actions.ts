"use server";

import { and, asc, count, eq, ilike } from "@repo/db";
import {
  db,
  RoomAmenities,
  RoomImages,
  Rooms,
} from "@repo/db";
import { revalidatePath } from "next/cache";

import { safeDbQuery } from "./utils/db-error-handler";

import type { TNewRoom, TRoom } from "@repo/db";

const ROOM_STATUS_VALUES = ["available", "occupied", "maintenance", "blocked"] as const;

type TGetRoomsFilters = {
  featured?: boolean;
  limit?: number;
  page?: number;
  search?: string;
  status?: "available" | "blocked" | "maintenance" | "occupied";
};

/** Build insert payload with only sanitized values (no spread of raw data). */
function sanitizeRoomPayload(data: Partial<TNewRoom> | TNewRoom): TNewRoom {
  const d = (data ?? {}) as Record<string, unknown>;
  const status = d.status != null && ROOM_STATUS_VALUES.includes(d.status as (typeof ROOM_STATUS_VALUES)[number])
    ? (d.status as (typeof ROOM_STATUS_VALUES)[number])
    : "available";
  const bedType = (d.bed_type ?? "double") as "double" | "king" | "queen" | "single" | "twin";
  return {
    base_price: toNumericString(d.base_price, "0"),
    bed_type: bedType,
    check_in_time: d.check_in_time != null && d.check_in_time !== "" ? String(d.check_in_time) : null,
    check_out_time: d.check_out_time != null && d.check_out_time !== "" ? String(d.check_out_time) : null,
    children_policy: d.children_policy != null && d.children_policy !== "" ? String(d.children_policy) : null,
    description: d.description != null && d.description !== "" ? String(d.description) : null,
    extra_beds: d.extra_beds != null && d.extra_beds !== "" ? String(d.extra_beds) : null,
    floor: d.floor != null && d.floor !== "" ? Math.max(0, Math.floor(Number(d.floor))) : null,
    image: d.image != null && d.image !== "" ? Number(d.image) : null,
    is_featured: (d.is_featured === true || d.is_featured === 1) ? 1 : 0,
    max_occupancy: Math.max(1, Math.floor(Number(d.max_occupancy) || 2)),
    notes: d.notes != null && d.notes !== "" ? String(d.notes) : null,
    number_of_beds: Math.max(0, Math.floor(Number(d.number_of_beds) || 1)),
    order: Math.max(0, Math.floor(Number(d.order) || 0)),
    peak_season_price: toOptionalNumeric(d.peak_season_price),
    rating: toOptionalRating(d.rating),
    review_count: Math.max(0, Math.floor(Number(d.review_count) || 0)),
    room_number: d.room_number != null && d.room_number !== "" ? String(d.room_number) : null,
    size_sqft: Math.max(0, Math.floor(Number(d.size_sqft) || 0)),
    slug: String(d.slug ?? ""),
    status,
    title: String(d.title ?? ""),
    video_url: d.video_url != null && d.video_url !== "" ? String(d.video_url) : null,
    weekend_price: toOptionalNumeric(d.weekend_price),
  } as TNewRoom;
}

function toNumericString(value: unknown, defaultVal: string): string {
  if (value === undefined || value === null || value === "") return defaultVal;
  const n = Number(String(value).trim());
  return Number.isNaN(n) ? defaultVal : n.toFixed(2);
}

function toOptionalNumeric(value: unknown): null | string {
  if (value === undefined || value === null || value === "") return null;
  const n = Number(String(value).trim());
  return Number.isNaN(n) ? null : n.toFixed(2);
}

function toOptionalRating(value: unknown): null | string {
  if (value === undefined || value === null || value === "") return null;
  const n = Number(String(value).trim());
  return Number.isNaN(n) ? null : n.toFixed(1);
}

export const getAllRoomSlugs = async () => {
  try {
    if (!db || !process.env.DATABASE_URL) return [];

    return await db.query.Rooms.findMany({
      columns: { created_at: true, slug: true, updated_at: true },
      where: eq(Rooms.status, "available"),
    });
  } catch (error) {
    console.error("Error fetching room slugs:", error);
    return [];
  }
};

export const getActiveRooms = async () => {
  try {
    if (!db || !process.env.DATABASE_URL) return [];

    return await db.query.Rooms.findMany({
      orderBy: (rooms, { asc }) => [asc(rooms.order), asc(rooms.id)],
      where: eq(Rooms.status, "available"),
      with: {
        amenities: {
          orderBy: (am, { asc }) => [asc(am.order)],
          with: { amenity: true },
        },
        image: true,
        images: {
          orderBy: (img, { asc }) => [asc(img.order)],
          with: { image: true },
        },
      },
    });
  } catch (error) {
    console.error("Error fetching active rooms:", error);
    return [];
  }
};

export const getRooms = async (filters: TGetRoomsFilters = {}) => {
  if (!db || !process.env.DATABASE_URL) {
    return { rooms: [], total: 0 };
  }

  const conditions = [];

  if (filters.search) {
    conditions.push(
      ilike(Rooms.title, `%${filters.search}%`)
    );
  }

  if (filters.status) {
    conditions.push(eq(Rooms.status, filters.status));
  }

  if (filters.featured === true) {
    conditions.push(eq(Rooms.is_featured, 1));
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const totalResult = await safeDbQuery(
    async () => {
      const result = await db
        .select({ count: count() })
        .from(Rooms)
        .where(where);
      return result[0]?.count ?? 0;
    },
    0,
    "rooms",
    "count query"
  );

  const total = typeof totalResult === "number" ? totalResult : 0;
  const page = Math.max(1, filters.page || 1);
  const limit = Math.max(1, filters.limit || 10);
  const offset = (page - 1) * limit;

  const rooms = await safeDbQuery(
    async () => {
      return await db.query.Rooms.findMany({
        limit,
        offset,
        orderBy: (rooms, { asc }) => [asc(rooms.order), asc(rooms.id)],
        where,
        with: {
          amenities: {
            orderBy: (am, { asc }) => [asc(am.order)],
            with: { amenity: true },
          },
          image: true,
          images: {
            orderBy: (img, { asc }) => [asc(img.order)],
            with: { image: true },
          },
        },
      });
    },
    [],
    "rooms",
    "findMany query"
  );

  return {
    rooms: (rooms || []) as unknown as TRoom[],
    total,
  };
};

export const getRoomById = async (id: number) => {
  try {
    if (!db) return null;

    return await db.query.Rooms.findFirst({
      where: eq(Rooms.id, id),
      with: {
        amenities: {
          orderBy: (a, { asc }) => [asc(a.order)],
          with: { amenity: true },
        },
        image: true,
        images: {
          orderBy: (img, { asc }) => [asc(img.order)],
          with: { image: true },
        },
      },
    });
  } catch (error) {
    console.error("Error fetching room by ID:", error);
    return null;
  }
};

export const getRoomBySlug = async (slug: string) => {
  try {
    if (!db) return null;

    return await db.query.Rooms.findFirst({
      where: eq(Rooms.slug, slug),
      with: {
        amenities: {
          orderBy: (a, { asc }) => [asc(a.order)],
          with: { amenity: true },
        },
        image: true,
        images: {
          orderBy: (img, { asc }) => [asc(img.order)],
          with: { image: true },
        },
      },
    });
  } catch (error) {
    console.error("Error fetching room by slug:", error);
    return null;
  }
};

export const createRoom = async (data: TNewRoom) => {
  try {
    if (!db) throw new Error("Database connection not available");

    const s = sanitizeRoomPayload(data);
    const insertRow = {
      base_price: s.base_price,
      bed_type: s.bed_type,
      check_in_time: s.check_in_time,
      check_out_time: s.check_out_time,
      children_policy: s.children_policy,
      description: s.description,
      extra_beds: s.extra_beds,
      floor: s.floor,
      image: s.image,
      is_featured: s.is_featured,
      max_occupancy: s.max_occupancy,
      notes: s.notes,
      number_of_beds: s.number_of_beds,
      order: s.order,
      peak_season_price: s.peak_season_price,
      rating: s.rating,
      review_count: s.review_count,
      room_number: s.room_number,
      size_sqft: s.size_sqft,
      slug: s.slug,
      status: s.status,
      title: s.title,
      video_url: s.video_url,
      weekend_price: s.weekend_price,
    };
    const [room] = await db.insert(Rooms).values(insertRow).returning();
    revalidatePath("/rooms");
    return room;
  } catch (error) {
    console.error("Error creating room:", error);
    throw error;
  }
};

function sanitizeRoomUpdate(data: Partial<TNewRoom>): Partial<TNewRoom> {
  const out: Partial<TNewRoom> = { ...data };
  if (data.base_price !== undefined) out.base_price = toNumericString(data.base_price, "0");
  if (data.peak_season_price !== undefined) out.peak_season_price = toOptionalNumeric(data.peak_season_price);
  if (data.weekend_price !== undefined) out.weekend_price = toOptionalNumeric(data.weekend_price);
  if (data.rating !== undefined) out.rating = toOptionalRating(data.rating);
  if (data.review_count !== undefined) out.review_count = Math.max(0, Math.floor(Number(data.review_count) || 0));
  if (data.is_featured !== undefined) out.is_featured = (data.is_featured === 1) ? 1 : 0;
  if (data.order !== undefined) out.order = Math.max(0, Math.floor(Number(data.order) || 0));
  if (data.status !== undefined && ROOM_STATUS_VALUES.includes(data.status as any))
    out.status = data.status;
  return out;
}

export const updateRoom = async (id: number, data: Partial<TNewRoom>) => {
  try {
    if (!db) throw new Error("Database connection not available");

    const sanitized = sanitizeRoomUpdate(data);
    const [updated] = await db
      .update(Rooms)
      .set({ ...sanitized, updated_at: new Date() })
      .where(eq(Rooms.id, id))
      .returning();
    revalidatePath("/rooms");
    revalidatePath(`/rooms/${id}`);
    return updated;
  } catch (error) {
    console.error("Error updating room:", error);
    throw error;
  }
};

export const deleteRoom = async (id: number) => {
  try {
    if (!db) throw new Error("Database connection not available");

    await db.delete(Rooms).where(eq(Rooms.id, id));
    revalidatePath("/rooms");
  } catch (error) {
    console.error("Error deleting room:", error);
    throw error;
  }
};

export const syncRoomImages = async (
  roomId: number,
  images: Array<{ image_id: number; order?: number }>
) => {
  if (!db) throw new Error("Database connection not available");

  await db.delete(RoomImages).where(eq(RoomImages.room_id, roomId));

  if (images.length > 0) {
    await db.insert(RoomImages).values(
      images.map((img, index) => ({
        image_id: img.image_id,
        order: img.order ?? index,
        room_id: roomId,
      }))
    );
  }

  revalidatePath("/rooms");
  revalidatePath(`/rooms/${roomId}`);
};

export const syncRoomAmenities = async (
  roomId: number,
  amenities: Array<{ amenity_id: number; order?: number }>
) => {
  if (!db) throw new Error("Database connection not available");

  await db.delete(RoomAmenities).where(eq(RoomAmenities.room_id, roomId));

  if (amenities.length > 0) {
    await db.insert(RoomAmenities).values(
      amenities.map((a, index) => ({
        amenity_id: a.amenity_id,
        order: a.order ?? index,
        room_id: roomId,
      }))
    );
  }

  revalidatePath("/rooms");
  revalidatePath(`/rooms/${roomId}`);
};