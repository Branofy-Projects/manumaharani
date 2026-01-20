"use server";
import { and, count, eq, ilike, inArray, or } from "@repo/db";
import { db, Rooms, RoomImages, Images } from "@repo/db";
import type { TNewRoom, TRoom } from "@repo/db";
import { safeDbQuery } from "./utils/db-error-handler";

type TGetRoomsFilters = {
  search?: string;
  page?: number;
  limit?: number;
  status?: "available" | "occupied" | "maintenance" | "blocked";
  room_type_id?: number;
};

export const getRooms = async (filters: TGetRoomsFilters = {}) => {
  if (!db || !process.env.DATABASE_URL) {
    return { rooms: [], total: 0 };
  }

  const conditions = [];
  
  if (filters.search) {
    conditions.push(
      ilike(Rooms.room_number, `%${filters.search}%`)
    );
  }
  
  if (filters.status) {
    conditions.push(eq(Rooms.status, filters.status));
  }
  
  if (filters.room_type_id) {
    conditions.push(eq(Rooms.room_type_id, filters.room_type_id));
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
        where,
        limit,
        offset,
        with: {
          roomType: true,
        },
        orderBy: (rooms, { asc }) => [asc(rooms.room_number)],
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
        roomType: true,
        images: {
          with: { image: true },
          orderBy: (images, { asc }) => [asc(images.order)],
        },
      },
    });
  } catch (error) {
    console.error("Error fetching room by ID:", error);
    return null;
  }
};

export const createRoom = async (data: TNewRoom) => {
  try {
    if (!db) throw new Error("Database connection not available");

    const [room] = await db.insert(Rooms).values(data).returning();
    
    return room;
  } catch (error) {
    console.error("Error creating room:", error);
    throw error;
  }
};

export const updateRoom = async (id: number, data: Partial<TNewRoom>) => {
  try {
    if (!db) throw new Error("Database connection not available");

    const [updated] = await db
      .update(Rooms)
      .set({ ...data, updated_at: new Date() })
      .where(eq(Rooms.id, id))
      .returning();
    
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
  } catch (error) {
    console.error("Error deleting room:", error);
    throw error;
  }
};

export const updateRoomImages = async (
  roomId: number,
  imageUpdates: Array<{
    image_id: number;
    order: number;
    alt_text?: string;
  }>
) => {
  if (!db) throw new Error("Database connection not available");

  // Get existing room images
  const existing = await db
    .select()
    .from(RoomImages)
    .where(eq(RoomImages.room_id, roomId));

  const existingImageIds = existing
    .filter((img) => img.image_id !== null)
    .map((img) => img.image_id as number);

  const newImageIds = imageUpdates.map((update) => update.image_id);

  // Identify images to delete (existing not in new list)
  const imagesToDelete = existingImageIds.filter(
    (existingImageId) => !newImageIds.includes(existingImageId)
  );

  // Identify images to create (new not in existing list)
  const imagesToCreate = imageUpdates.filter(
    (update) => !existingImageIds.includes(update.image_id)
  );

  const operations = [];

  // Delete removed images
  if (imagesToDelete.length > 0) {
    operations.push(
      db
        .delete(RoomImages)
        .where(
          and(
            eq(RoomImages.room_id, roomId),
            inArray(RoomImages.image_id, imagesToDelete)
          )
        )
    );
  }

  // Create new images
  if (imagesToCreate.length > 0) {
    const newImages = imagesToCreate.map((update) => ({
      room_id: roomId,
      image_id: update.image_id,
      order: update.order,
    }));
    operations.push(db.insert(RoomImages).values(newImages));
  }

  // Update order for existing images
  const imagesToUpdate = existing.filter(
    (img) => img.image_id !== null && newImageIds.includes(img.image_id)
  );

  for (const img of imagesToUpdate) {
    if (img.image_id !== null) {
      const updateData = imageUpdates.find((u) => u.image_id === img.image_id);
      if (updateData && img.order !== updateData.order) {
        operations.push(
          db
            .update(RoomImages)
            .set({ order: updateData.order })
            .where(eq(RoomImages.id, img.id))
        );
      }
    }
  }

  // Execute all operations
  if (operations.length > 0) {
    await Promise.all(operations);
  }

  // Update alt text for images if provided
  const imageAltTextUpdates = imageUpdates.filter(
    (update) => update.alt_text !== undefined
  );
  if (imageAltTextUpdates.length > 0) {
    const altTextOperations = imageAltTextUpdates.map((update) =>
      db
        .update(Images)
        .set({ alt_text: update.alt_text })
        .where(eq(Images.id, update.image_id))
    );
    await Promise.all(altTextOperations);
  }

  // Return updated room images
  return await db
    .select()
    .from(RoomImages)
    .where(eq(RoomImages.room_id, roomId))
    .orderBy(RoomImages.order);
};

