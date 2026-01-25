"use server";

import { and, count, desc, eq, ilike } from "@repo/db";
import { db, Offers } from "@repo/db";
import { revalidatePath } from "next/cache";

import { safeDbQuery } from "./utils/db-error-handler";

import type { TNewOffer } from "@repo/db/schema/offers.schema";
import type { TOffer } from "@repo/db/schema/types.schema";

type TGetOffersFilters = {
  limit?: number;
  page?: number;  
  search?: string;
  status?: "active" | "inactive";
};

export const getOffers = async (filters: TGetOffersFilters = {}) => {
  const conditions = [];

  if (filters.search) {
    conditions.push(ilike(Offers.name, `%${filters.search}%`));
  }

  if (filters.status) {
    conditions.push(eq(Offers.active, filters.status === "active"));
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const totalResult = await safeDbQuery(
    async () => {
      const result = await db
        .select({ count: count() })
        .from(Offers)
        .where(where);
      return result[0]?.count ?? 0;
    },
    0,
    "offers",
    "count query"
  );

  const total = typeof totalResult === "number" ? totalResult : 0;

  const page = Math.max(1, filters.page || 1);
  const limit = Math.max(1, filters.limit || 10);
  const offset = (page - 1) * limit;

  const offers = await safeDbQuery(
    async () => {
      return await db.query.Offers.findMany({
        limit,
        offset,
        orderBy: (offers, { desc }) => [desc(offers.name)], // Default sort by name or created_at if available
        where,
        with: {
          image: true,
        },
      });
    },
    [],
    "offers",
    "findMany query"
  );

  return {
    offers: (offers || []) as unknown as TOffer[],
    total,
  };
};

export const getOfferById = async (id: string): Promise<TOffer | undefined> => {
  return db.query.Offers.findFirst({
    where: eq(Offers.id, id),
    with: {
      image: true,
    },
  }) as Promise<TOffer | undefined>;
};

export const createOffer = async (data: TNewOffer) => {
  const [offer] = await db.insert(Offers).values(data).returning();
  revalidatePath("/offers");
  return offer;
};

export const updateOffer = async (id: string, data: Partial<TNewOffer>) => {
  const [updated] = await db
    .update(Offers)
    .set(data)
    .where(eq(Offers.id, id))
    .returning();
  revalidatePath("/offers");
  return updated;
};

export const deleteOffer = async (id: string) => {
  await db.delete(Offers).where(eq(Offers.id, id));
  revalidatePath("/offers");
};
