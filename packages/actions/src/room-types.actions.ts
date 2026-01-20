"use server";
import { and, count, eq, ilike, inArray } from "@repo/db";
import { db, RoomTypes, RoomTypeImages, Images } from "@repo/db";
import type { TNewRoomType, TRoomType } from "@repo/db";

import { getOrSet, bumpVersion } from "./libs/cache";
import { roomTypeBySlugKey, roomTypesListKey } from "./libs/keys";
import { safeDbQuery } from "./utils/db-error-handler";

type TGetRoomTypesFilters = {
  search?: string;
  page?: number;
  limit?: number;
  status?: "active" | "inactive";
};

export const getRoomTypes = async (filters: TGetRoomTypesFilters = {}) => {
  if (!db || !process.env.DATABASE_URL) {
    return { roomTypes: [], total: 0 };
  }

  const conditions = [];

  if (filters.search) {
    conditions.push(ilike(RoomTypes.name, `%${filters.search}%`));
  }

  if (filters.status) {
    conditions.push(eq(RoomTypes.status, filters.status));
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  // Get total count with error handling
  const totalResult = await safeDbQuery(
    async () => {
      const result = await db
        .select({ count: count() })
        .from(RoomTypes)
        .where(where);
      return result[0]?.count ?? 0;
    },
    0,
    "room_types",
    "count query"
  );

  const total = typeof totalResult === "number" ? totalResult : 0;

  const page = Math.max(1, filters.page || 1);
  const limit = Math.max(1, filters.limit || 10);
  const offset = (page - 1) * limit;

  // Get room types with error handling
  const roomTypes = await safeDbQuery(
    async () => {
      return await db.query.RoomTypes.findMany({
        where,
        limit,
        offset,
        with: {
          images: {
            with: { image: true },
            orderBy: (images, { asc }) => [asc(images.order)],
          },
          amenities: {
            with: { amenity: true },
            orderBy: (amenities, { asc }) => [asc(amenities.order)],
          },
          policies: {
            with: { policy: true },
            orderBy: (policies, { asc }) => [asc(policies.order)],
          },
          faqs: {
            with: { faq: true },
            orderBy: (faqs, { asc }) => [asc(faqs.order)],
          },
        },
        orderBy: (roomTypes, { asc }) => [asc(roomTypes.order)],
      });
    },
    [],
    "room_types",
    "findMany query"
  );

  return {
    roomTypes: (roomTypes || []) as unknown as TRoomType[],
    total,
  };
};

export const getRoomTypeBySlug = async (slug: string) => {
  if (!db) return null;

  return getOrSet(
    () =>
      db!.query.RoomTypes.findFirst({
        where: eq(RoomTypes.slug, slug),
        with: {
          images: {
            with: { image: true },
            orderBy: (images, { asc }) => [asc(images.order)],
          },
          amenities: {
            with: { amenity: true },
            orderBy: (amenities, { asc }) => [asc(amenities.order)],
          },
          policies: {
            with: { policy: true },
            orderBy: (policies, { asc }) => [asc(policies.order)],
          },
          faqs: {
            with: { faq: true },
            orderBy: (faqs, { asc }) => [asc(faqs.order)],
          },
        },
      }),
    {
      key: await roomTypeBySlugKey(slug),
    }
  );
};

export const createRoomType = async (data: TNewRoomType) => {
  if (!db) {
    const error = new Error("Database connection not available");
    console.error("createRoomType error:", error);
    throw error;
  }

  try {
    const [roomType] = await db.insert(RoomTypes).values(data).returning();

    await bumpVersion("room-types");

    return roomType;
  } catch (error: any) {
    // Extract the actual database error from nested error objects
    const actualError = error?.cause || error?.originalError || error;
    const errorMessage =
      actualError?.message || error?.message || String(error);
    const errorString =
      String(actualError).toLowerCase() + " " + errorMessage.toLowerCase();

    console.error(
      "Error creating room type - Full error object:",
      JSON.stringify(error, null, 2)
    );
    console.error("Error message:", errorMessage);
    console.error("Error cause:", error?.cause);
    console.error("Error string:", errorString);

    // Check if it's a resort_id constraint error (check all possible error locations)
    if (
      errorString.includes("resort_id") ||
      errorString.includes("null value") ||
      errorString.includes("not null") ||
      errorString.includes("violates not-null constraint") ||
      (errorString.includes("column") && errorString.includes("null")) ||
      errorMessage.includes("resort_id") ||
      errorMessage.includes("null value") ||
      errorMessage.includes("NOT NULL")
    ) {
      const dbError = new Error(
        "❌ DATABASE ERROR: resort_id constraint still exists. The database requires resort_id but your code doesn't provide it. Run the SQL in FIX_IT_NOW.md (Option 1) or run: yarn workspace @repo/db db:push"
      );
      console.error("Database constraint error detected:", dbError);
      throw dbError;
    }

    // Check if it's a duplicate slug error
    if (
      errorString.includes("duplicate key") ||
      errorString.includes("unique constraint") ||
      errorString.includes("slug_unique") ||
      errorMessage.includes("duplicate key") ||
      errorMessage.includes("unique constraint")
    ) {
      const duplicateError = new Error(
        "A room type with this name already exists. Please use a different name."
      );
      console.error("Duplicate slug error:", duplicateError);
      throw duplicateError;
    }

    // Re-throw with the actual error message
    const friendlyError = new Error(
      `Failed to create room type: ${errorMessage}. Check server logs for details.`
    );
    console.error("Re-throwing error:", friendlyError);
    throw friendlyError;
  }
};

export const updateRoomType = async (
  id: number,
  data: Partial<TNewRoomType>
) => {
  if (!db) throw new Error("Database connection not available");

  const [updated] = await db
    .update(RoomTypes)
    .set({ ...data, updated_at: new Date() })
    .where(eq(RoomTypes.id, id))
    .returning();

  await bumpVersion("room-types");

  return updated;
};

export const getRoomTypeById = async (id: number) => {
  if (!db) return null;

  return db.query.RoomTypes.findFirst({
    where: eq(RoomTypes.id, id),
    with: {
      images: {
        with: { image: true },
        orderBy: (images, { asc }) => [asc(images.order)],
      },
      amenities: {
        with: { amenity: true },
        orderBy: (amenities, { asc }) => [asc(amenities.order)],
      },
      policies: {
        with: { policy: true },
        orderBy: (policies, { asc }) => [asc(policies.order)],
      },
      faqs: {
        with: { faq: true },
        orderBy: (faqs, { asc }) => [asc(faqs.order)],
      },
    },
  });
};

export const deleteRoomType = async (id: number) => {
  if (!db) throw new Error("Database connection not available");

  await db.delete(RoomTypes).where(eq(RoomTypes.id, id));

  await bumpVersion("room-types");
};

export const updateRoomTypeImages = async (
  roomTypeId: number,
  imageUpdates: Array<{
    image_id: number;
    order: number;
    alt_text?: string;
  }>
) => {
  if (!db) throw new Error("Database connection not available");

  // Get existing room type images
  const existing = await db
    .select()
    .from(RoomTypeImages)
    .where(eq(RoomTypeImages.room_type_id, roomTypeId));

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
        .delete(RoomTypeImages)
        .where(
          and(
            eq(RoomTypeImages.room_type_id, roomTypeId),
            inArray(RoomTypeImages.image_id, imagesToDelete)
          )
        )
    );
  }

  // Create new images
  if (imagesToCreate.length > 0) {
    const newImages = imagesToCreate.map((update) => ({
      room_type_id: roomTypeId,
      image_id: update.image_id,
      order: update.order,
    }));
    operations.push(db.insert(RoomTypeImages).values(newImages));
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
            .update(RoomTypeImages)
            .set({ order: updateData.order })
            .where(eq(RoomTypeImages.id, img.id))
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

  await bumpVersion("room-types");

  // Return updated room type images
  return await db
    .select()
    .from(RoomTypeImages)
    .where(eq(RoomTypeImages.room_type_id, roomTypeId))
    .orderBy(RoomTypeImages.order);
};
