"use server";
import { and, count, eq, ilike } from "@repo/db";
import { db, Gallery } from "@repo/db";

import { revalidateTags } from "./client.actions";
import { bumpVersion, GALLERY_CACHE_KEY } from "./libs/cache";
import { safeDbQuery } from "./utils/db-error-handler";

import type { TGallery, TGalleryCategory, TNewGallery } from "@repo/db";

type TGetGalleryFilters = {
  category?: string;
  limit?: number;
  page?: number;
  search?: string;
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
    conditions.push(eq(Gallery.category, filters.category as TGalleryCategory));
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
        limit,
        offset,
        orderBy: (gallery, { asc }) => [asc(gallery.order), asc(gallery.created_at)],
        where,
        with: {
          image: true,
          videoThumbnail: true,
        },
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

export const getAllGallery = async () => {
  if (!db || !process.env.DATABASE_URL) {
    return [];
  }

  const gallery = await safeDbQuery(
    async () => {
      return await db.query.Gallery.findMany({
        orderBy: (gallery, { asc }) => [asc(gallery.order), asc(gallery.created_at)],
        with: {
          image: true,
          videoThumbnail: true,
        },
      });
    },
    [],
    "gallery",
    "findAll query"
  );

  return (gallery || []) as unknown as TGallery[];
};

export const getGalleryByCategory = async (category: string) => {
  if (!db || !process.env.DATABASE_URL) {
    return [];
  }

  const gallery = await safeDbQuery(
    async () => {
      return await db.query.Gallery.findMany({
        orderBy: (gallery, { asc }) => [asc(gallery.order), asc(gallery.created_at)],
        where: eq(Gallery.category, category as TGalleryCategory),
        with: {
          image: true,
          videoThumbnail: true,
        },
      });
    },
    [],
    "gallery",
    "findByCategory query"
  );

  return (gallery || []) as unknown as TGallery[];
};

export const getGalleryById = async (id: number) => {
  try {
    if (!db) return null;

    return await db.query.Gallery.findFirst({
      where: eq(Gallery.id, id),
      with: {
        image: true,
        videoThumbnail: true,
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
    await revalidateTags([GALLERY_CACHE_KEY]);

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
    await revalidateTags([GALLERY_CACHE_KEY]);

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
    await revalidateTags([GALLERY_CACHE_KEY]);
  } catch (error) {
    console.error("Error deleting gallery item:", error);
    throw error;
  }
};
