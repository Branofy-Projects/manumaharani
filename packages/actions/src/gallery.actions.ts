"use server";
import { and, count, eq, ilike } from "@repo/db";
import { db, Gallery } from "@repo/db";
import type { TNewGallery, TGallery } from "@repo/db";

import { bumpVersion } from "./libs/cache";
import { safeDbQuery } from "./utils/db-error-handler";

type TGetGalleryFilters = {
  search?: string;
  page?: number;
  limit?: number;
  category?: string;
  type?: string;
};

export const getGallery = async (filters: TGetGalleryFilters = {}) => {
  if (!db || !process.env.DATABASE_URL) {
    return { gallery: [], total: 0 };
  }

  const conditions = [];
  
  if (filters.search) {
    conditions.push(ilike(Gallery.title, `%${filters.search}%`));
  }
  
  if (filters.category) {
    conditions.push(eq(Gallery.category, filters.category as any));
  }
  
  if (filters.type) {
    conditions.push(eq(Gallery.type, filters.type as any));
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const totalResult = await safeDbQuery(
    async () => {
      const result = await db
        .select({ count: count() })
        .from(Gallery)
        .where(where);
      return result[0]?.count ?? 0;
    },
    0,
    "gallery",
    "count query"
  );

  const total = typeof totalResult === "number" ? totalResult : 0;

  const page = Math.max(1, filters.page || 1);
  const limit = Math.max(1, filters.limit || 10);
  const offset = (page - 1) * limit;

  const gallery = await safeDbQuery(
    async () => {
      return await db.query.Gallery.findMany({
        where,
        limit,
        offset,
        with: {
          image: true,
          videoThumbnail: true,
          resort: true,
        },
        orderBy: (gallery, { desc }) => [desc(gallery.created_at)],
      });
    },
    [],
    "gallery",
    "findMany query"
  );

  return {
    gallery: (gallery || []) as unknown as TGallery[],
    total,
  };
};

export const getGalleryById = async (id: number) => {
  try {
    if (!db) return null;

    return await db.query.Gallery.findFirst({
      where: eq(Gallery.id, id),
      with: {
        image: true,
        videoThumbnail: true,
        resort: true,
      },
    });
  } catch (error) {
    console.error("Error fetching gallery by ID:", error);
    return null;
  }
};

export const createGallery = async (data: TNewGallery) => {
  try {
    if (!db) throw new Error("Database connection not available");

    const [item] = await db.insert(Gallery).values(data).returning();
    
    await bumpVersion("gallery");
    
    return item;
  } catch (error) {
    console.error("Error creating gallery item:", error);
    throw error;
  }
};

export const updateGallery = async (id: number, data: Partial<TNewGallery>) => {
  try {
    if (!db) throw new Error("Database connection not available");

    const [updated] = await db
      .update(Gallery)
      .set({ ...data, updated_at: new Date() })
      .where(eq(Gallery.id, id))
      .returning();
    
    await bumpVersion("gallery");
    
    return updated;
  } catch (error) {
    console.error("Error updating gallery item:", error);
    throw error;
  }
};

export const deleteGallery = async (id: number) => {
  try {
    if (!db) throw new Error("Database connection not available");

    await db.delete(Gallery).where(eq(Gallery.id, id));
    
    await bumpVersion("gallery");
  } catch (error) {
    console.error("Error deleting gallery item:", error);
    throw error;
  }
};

