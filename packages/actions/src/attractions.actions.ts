"use server";

import { asc, eq } from "@repo/db";
import { db, Attractions } from "@repo/db";
import { revalidatePath } from "next/cache";

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
    },
  }) as Promise<TAttraction | undefined>;
};

/**
 * Create a new attraction
 * Image is stored as FK to Images.id (same pattern as offers featured image)
 */
export const createAttraction = async (data: TNewAttraction) => {
  const values = {
    title: data.title,
    subtitle: data.subtitle,
    link: data.link ?? "#",
    image: data.image ?? null,
    active: data.active ?? true,
    order: Number(data.order) ?? 0,
    distance: data.distance ?? null,
  };
  const [attraction] = await db.insert(Attractions).values(values).returning();
  revalidatePath("/attractions");
  revalidatePath("/nearby-attractions");
  revalidatePath("/");
  return attraction;
};

/**
 * Update an existing attraction
 */
export const updateAttraction = async (id: string, data: Partial<TNewAttraction>) => {
  const setValues: Record<string, unknown> = {};
  if (data.title !== undefined) setValues.title = data.title;
  if (data.subtitle !== undefined) setValues.subtitle = data.subtitle;
  if (data.link !== undefined) setValues.link = data.link;
  if (data.image !== undefined) setValues.image = data.image;
  if (data.active !== undefined) setValues.active = data.active;
  if (data.order !== undefined) setValues.order = Number(data.order);
  if (data.distance !== undefined) setValues.distance = data.distance ?? null;

  const [updated] = await db
    .update(Attractions)
    .set(setValues as Partial<TNewAttraction>)
    .where(eq(Attractions.id, id))
    .returning();
  revalidatePath("/attractions");
  revalidatePath("/nearby-attractions");
  revalidatePath("/");
  return updated;
};

/**
 * Delete an attraction
 */
export const deleteAttraction = async (id: string) => {
  await db.delete(Attractions).where(eq(Attractions.id, id));
  revalidatePath("/attractions");
  revalidatePath("/nearby-attractions");
  revalidatePath("/");
};
