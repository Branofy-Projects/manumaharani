"use server";

import { asc, eq } from "@repo/db";
import { AttractionImages, Attractions, db } from "@repo/db";
import { revalidatePath } from "next/cache";

import { revalidateTags } from "./client.actions";
import { ATTRACTIONS_CACHE_KEY, getAttractionBySlugKey } from "./libs/cache";
import { safeDbQuery } from "./utils/db-error-handler";

import type { TNewAttraction } from "@repo/db/schema/attractions.schema";
import type { TAttraction } from "@repo/db/schema/types.schema";

/**
 * Get all attractions ordered by display order
 * @param activeOnly - If true, only return active attractions
 */
export const getAttractions = async (activeOnly = false) => {
  const conditions = activeOnly ? eq(Attractions.active, true) : undefined;

  const attractions = await safeDbQuery(
    async () => {
      return await db.query.Attractions.findMany({
        orderBy: (attractions) => [asc(attractions.order), asc(attractions.created_at)],
        where: conditions,
        with: {
          image: true,
          images: { orderBy: (img, { asc }) => [asc(img.order)], with: { image: true } },
        },
      });
    },
    [],
    "attractions",
    "findMany query"
  );

  return (attractions || []) as unknown as TAttraction[];
};

/**
 * Get a single attraction by ID
 */
export const getAttractionById = async (id: string): Promise<TAttraction | undefined> => {
  return db.query.Attractions.findFirst({
    where: eq(Attractions.id, id),
    with: {
      image: true,
      images: { orderBy: (img, { asc }) => [asc(img.order)], with: { image: true } },
    },
  }) as Promise<TAttraction | undefined>;
};

/**
 * Get a single attraction by slug (for detail page)
 */
export const getAttractionBySlug = async (slug: string): Promise<TAttraction | undefined> => {
  return db.query.Attractions.findFirst({
    where: eq(Attractions.slug, slug),
    with: {
      image: true,
      images: { orderBy: (img, { asc }) => [asc(img.order)], with: { image: true } },
    },
  }) as Promise<TAttraction | undefined>;
};

/**
 * Create a new attraction
 * Image is stored as FK to Images.id (same pattern as offers featured image)
 */
export const createAttraction = async (data: TNewAttraction) => {
  const values = {
    active: data.active ?? true,
    close_time: data.close_time ?? null,
    description: data.description ?? null,
    distance: data.distance ?? null,
    faq: data.faq ?? null,
    image: data.image ?? null,
    link: data.link ?? "#",
    open_time: data.open_time ?? null,
    order: Number(data.order) ?? 0,
    slug: data.slug,
    subtitle: data.subtitle,
    title: data.title,
  };
  try {
    const [attraction] = await db.insert(Attractions).values(values).returning();
    revalidatePath("/nearby-attractions");
    revalidatePath("/");
    revalidateTags([ATTRACTIONS_CACHE_KEY, getAttractionBySlugKey(attraction.slug)]);
    return attraction;
  } catch (err) {
    console.error("createAttraction failed:", err);
    throw err;
  }
};

/**
 * Update an existing attraction
 */
export const updateAttraction = async (id: string, data: Partial<TNewAttraction>) => {
  const setValues: Record<string, unknown> = {};
  if (data.title !== undefined) setValues.title = data.title;
  if (data.slug !== undefined) setValues.slug = data.slug;
  if (data.subtitle !== undefined) setValues.subtitle = data.subtitle;
  if (data.description !== undefined) setValues.description = data.description ?? null;
  if (data.link !== undefined) setValues.link = data.link;
  if (data.image !== undefined) setValues.image = data.image;
  if (data.active !== undefined) setValues.active = data.active;
  if (data.order !== undefined) setValues.order = Number(data.order);
  if (data.distance !== undefined) setValues.distance = data.distance ?? null;
  if (data.open_time !== undefined) setValues.open_time = data.open_time ?? null;
  if (data.close_time !== undefined) setValues.close_time = data.close_time ?? null;
  if (data.faq !== undefined) setValues.faq = data.faq ?? null;

  const [updated] = await db
    .update(Attractions)
    .set(setValues as Partial<TNewAttraction>)
    .where(eq(Attractions.id, id))
    .returning();
  revalidatePath("/nearby-attractions");
  revalidatePath(`/nearby-attractions/${updated.slug}`);
  revalidatePath("/");
  revalidateTags([ATTRACTIONS_CACHE_KEY, getAttractionBySlugKey(updated.slug)]);
  return updated;
};

/**
 * Delete an attraction
 */
export const deleteAttraction = async (id: string) => {
  const attraction = await db.query.Attractions.findFirst({
    where: eq(Attractions.id, id),
  });
  await db.delete(Attractions).where(eq(Attractions.id, id));
  revalidatePath("/nearby-attractions");
  revalidatePath("/");
  revalidateTags([ATTRACTIONS_CACHE_KEY, ...(attraction?.slug ? [getAttractionBySlugKey(attraction.slug)] : [])]);
};

/**
 * Sync gallery images for an attraction (delete all + re-insert)
 */
export const syncAttractionImages = async (
  attractionId: string,
  images: Array<{ image_id: number; order?: number }>
) => {
  await db.delete(AttractionImages).where(eq(AttractionImages.attraction_id, attractionId));

  if (images.length > 0) {
    await db.insert(AttractionImages).values(
      images.map((img, index) => ({
        attraction_id: attractionId,
        image_id: img.image_id,
        order: img.order ?? index,
      }))
    );
  }

  const attraction = await db.query.Attractions.findFirst({
    where: eq(Attractions.id, attractionId),
  });
  revalidatePath("/nearby-attractions");
  revalidatePath("/");
  revalidateTags([ATTRACTIONS_CACHE_KEY, ...(attraction?.slug ? [getAttractionBySlugKey(attraction.slug)] : [])]);
};