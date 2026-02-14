"use server";
import { count, eq, sql } from "@repo/db";
import { db } from "@repo/db";
import { Experiences } from "@repo/db/schema/experiences.schema";

import { revalidateTags } from "./client.actions";
import { bumpVersion } from "./libs/cache";
import { safeDbQuery } from "./utils/db-error-handler";

import type { TExperience, TNewExperience } from "@repo/db";

const MAX_EXPERIENCES = 4;

export const getExperiences = async () => {
  if (!db || !process.env.DATABASE_URL) {
    return { experiences: [], total: 0 };
  }

  const totalResult = await safeDbQuery(
    async () => {
      const result = await db
        .select({ count: count() })
        .from(Experiences);
      return result[0]?.count ?? 0;
    },
    0,
    "experiences",
    "count query"
  );

  const total = typeof totalResult === "number" ? totalResult : 0;

  const experiences = await safeDbQuery(
    async () => {
      return await db.query.Experiences.findMany({
        orderBy: (experiences, { asc }) => [asc(experiences.order), asc(experiences.created_at)],
      });
    },
    [],
    "experiences",
    "findMany query"
  );

  return {
    experiences: (experiences || []) as unknown as TExperience[],
    total,
  };
};

export const getExperienceById = async (id: number) => {
  try {
    if (!db) return null;

    return await db.query.Experiences.findFirst({
      where: eq(Experiences.id, id),
    });
  } catch (error) {
    console.error("Error fetching experience by ID:", error);
    return null;
  }
};

export const createExperience = async (data: TNewExperience) => {
  try {
    if (!db) throw new Error("Database connection not available");

    // Enforce max 4 experiences
    const countResult = await db
      .select({ count: count() })
      .from(Experiences);
    const currentCount = countResult[0]?.count ?? 0;

    if (currentCount >= MAX_EXPERIENCES) {
      throw new Error(`Maximum of ${MAX_EXPERIENCES} experiences allowed`);
    }

    // Auto-assign next order value
    const maxOrderResult = await db
      .select({ maxOrder: sql<number>`COALESCE(MAX(${Experiences.order}), -1)` })
      .from(Experiences);
    const nextOrder = (maxOrderResult[0]?.maxOrder ?? -1) + 1;

    const [experience] = await db.insert(Experiences).values({ ...data, order: nextOrder }).returning();

    await bumpVersion("experiences");
    await revalidateTags(["experiences"]);

    return experience;
  } catch (error) {
    console.error("Error creating experience:", error);
    throw error;
  }
};

export const updateExperience = async (id: number, data: Partial<TNewExperience>) => {
  try {
    if (!db) throw new Error("Database connection not available");

    const [updated] = await db
      .update(Experiences)
      .set({ ...data, updated_at: new Date() })
      .where(eq(Experiences.id, id))
      .returning();

    // await bumpVersion("experiences");
    await revalidateTags(["experiences"]);

    return updated;
  } catch (error) {
    console.error("Error updating experience:", error);
    throw error;
  }
};

export const deleteExperience = async (id: number) => {
  try {
    if (!db) throw new Error("Database connection not available");

    await db.delete(Experiences).where(eq(Experiences.id, id));

    await bumpVersion("experiences");
  } catch (error) {
    console.error("Error deleting experience:", error);
    throw error;
  }
};

export const reorderExperiences = async (orderedIds: number[]) => {
  try {
    if (!db) throw new Error("Database connection not available");

    await Promise.all(
      orderedIds.map((id, index) =>
        db
          .update(Experiences)
          .set({ order: index, updated_at: new Date() })
          .where(eq(Experiences.id, id))
      )
    );

    await bumpVersion("experiences");
    await revalidateTags(["experiences"]);
  } catch (error) {
    console.error("Error reordering experiences:", error);
    throw error;
  }
};
