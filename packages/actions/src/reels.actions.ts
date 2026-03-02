"use server";

import { count, eq, sql } from "@repo/db";
import { db } from "@repo/db";
import { Reels } from "@repo/db/schema/reels.schema";

import { revalidateTags } from "./client.actions";
import { bumpVersion } from "./libs/cache";
import { safeDbQuery } from "./utils/db-error-handler";

import type { TNewReel, TReel } from "@repo/db";

export const getReels = async () => {
  if (!db || !process.env.DATABASE_URL) {
    return { reels: [], total: 0 };
  }

  const totalResult = await safeDbQuery(
    async () => {
      const result = await db.select({ count: count() }).from(Reels);
      return result[0]?.count ?? 0;
    },
    0,
    "reels",
    "count query"
  );

  const total = typeof totalResult === "number" ? totalResult : 0;

  const reels = await safeDbQuery(
    async () => {
      return await db.query.Reels.findMany({
        orderBy: (reels, { asc }) => [asc(reels.order), asc(reels.created_at)],
      });
    },
    [],
    "reels",
    "findMany query"
  );

  return {
    reels: (reels || []) as unknown as TReel[],
    total,
  };
};

export const getActiveReels = async () => {
  if (!db || !process.env.DATABASE_URL) {
    return [];
  }

  const reels = await safeDbQuery(
    async () => {
      return await db.query.Reels.findMany({
        orderBy: (reels, { asc }) => [asc(reels.order), asc(reels.created_at)],
        where: eq(Reels.status, "active"),
      });
    },
    [],
    "reels",
    "active reels query"
  );

  return (reels || []) as unknown as TReel[];
};

export const getReelById = async (id: number) => {
  try {
    if (!db) return null;

    return await db.query.Reels.findFirst({
      where: eq(Reels.id, id),
    });
  } catch (error) {
    console.error("Error fetching reel by ID:", error);
    return null;
  }
};

export const createReel = async (data: TNewReel) => {
  try {
    if (!db) throw new Error("Database connection not available");

    const maxOrderResult = await db
      .select({ maxOrder: sql<number>`COALESCE(MAX(${Reels.order}), -1)` })
      .from(Reels);
    const nextOrder = (maxOrderResult[0]?.maxOrder ?? -1) + 1;

    const [reel] = await db.insert(Reels).values({ ...data, order: nextOrder }).returning();

    await bumpVersion("reels");
    await revalidateTags(["reels"]);

    return reel;
  } catch (error) {
    console.error("Error creating reel:", error);
    throw error;
  }
};

export const updateReel = async (id: number, data: Partial<TNewReel>) => {
  try {
    if (!db) throw new Error("Database connection not available");

    const [updated] = await db
      .update(Reels)
      .set({ ...data, updated_at: new Date() })
      .where(eq(Reels.id, id))
      .returning();

    await bumpVersion("reels");
    await revalidateTags(["reels"]);

    return updated;
  } catch (error) {
    console.error("Error updating reel:", error);
    throw error;
  }
};

export const deleteReel = async (id: number) => {
  try {
    if (!db) throw new Error("Database connection not available");

    await db.delete(Reels).where(eq(Reels.id, id));

    await bumpVersion("reels");
    await revalidateTags(["reels"]);
  } catch (error) {
    console.error("Error deleting reel:", error);
    throw error;
  }
};

export const reorderReels = async (orderedIds: number[]) => {
  try {
    if (!db) throw new Error("Database connection not available");

    await Promise.all(
      orderedIds.map((id, index) =>
        db
          .update(Reels)
          .set({ order: index, updated_at: new Date() })
          .where(eq(Reels.id, id))
      )
    );

    await bumpVersion("reels");
    await revalidateTags(["reels"]);
  } catch (error) {
    console.error("Error reordering reels:", error);
    throw error;
  }
};

export const getVideoUploadUrl = async (filename: string, contentType: string) => {
  try {
    const { generateSignedUploadUrl } = await import("./libs/gcs");
    const { publicUrl, signedUrl } = await generateSignedUploadUrl(filename, contentType, 'reels');
    return { publicUrl, signedUrl };
  } catch (error) {
    console.error("Error generating video upload URL:", error);
    throw new Error("Failed to generate upload URL");
  }
};
