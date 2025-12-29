"use server";
import { db, Amenities, Policies, Faqs } from "@repo/db";
import type { TNewAmenity, TNewPolicy, TNewFaq } from "@repo/db";
import { eq } from "@repo/db";
import { safeDbQuery } from "./utils/db-error-handler";

export const getAmenities = async () => {
  if (!db || !process.env.DATABASE_URL) {
    return [];
  }

  return await safeDbQuery(
    async () => {
      return await db.query.Amenities.findMany({
        orderBy: (amenities, { asc }) => [asc(amenities.label)],
      });
    },
    [],
    "amenities",
    "findMany query"
  );
};

export const createAmenity = async (data: TNewAmenity) => {
  if (!db) throw new Error("Database connection not available");

  const [amenity] = await db.insert(Amenities).values(data).returning();
  
  return amenity;
};

export const updateAmenity = async (id: number, data: Partial<TNewAmenity>) => {
  if (!db) throw new Error("Database connection not available");

  const [updated] = await db
    .update(Amenities)
    .set(data)
    .where(eq(Amenities.id, id))
    .returning();
  
  return updated;
};

export const getAmenityById = async (id: number) => {
  if (!db) return null;

  return db.query.Amenities.findFirst({
    where: eq(Amenities.id, id),
  });
};

export const deleteAmenity = async (id: number) => {
  if (!db) throw new Error("Database connection not available");

  await db.delete(Amenities).where(eq(Amenities.id, id));
};

export const getPolicies = async () => {
  if (!db || !process.env.DATABASE_URL) {
    return [];
  }

  return await safeDbQuery(
    async () => {
      return await db.query.Policies.findMany({
        orderBy: (policies, { asc }) => [asc(policies.label)],
      });
    },
    [],
    "policies",
    "findMany query"
  );
};

export const getPoliciesByKind = async (kind: "include" | "exclude") => {
  if (!db) return [];

  return db.query.Policies.findMany({
    where: eq(Policies.kind, kind),
    orderBy: (policies, { asc }) => [asc(policies.label)],
  });
};

export const createPolicy = async (data: TNewPolicy) => {
  if (!db) throw new Error("Database connection not available");

  const [policy] = await db.insert(Policies).values(data).returning();
  
  return policy;
};

export const updatePolicy = async (id: number, data: Partial<TNewPolicy>) => {
  if (!db) throw new Error("Database connection not available");

  const [updated] = await db
    .update(Policies)
    .set(data)
    .where(eq(Policies.id, id))
    .returning();
  
  return updated;
};

export const getPolicyById = async (id: number) => {
  if (!db) return null;

  return db.query.Policies.findFirst({
    where: eq(Policies.id, id),
  });
};

export const deletePolicy = async (id: number) => {
  if (!db) throw new Error("Database connection not available");

  await db.delete(Policies).where(eq(Policies.id, id));
};

export const getFaqs = async () => {
  if (!db || !process.env.DATABASE_URL) {
    return [];
  }

  return await safeDbQuery(
    async () => {
      return await db.query.Faqs.findMany();
    },
    [],
    "faqs",
    "findMany query"
  );
};

export const createFaq = async (data: TNewFaq) => {
  if (!db) throw new Error("Database connection not available");

  const [faq] = await db.insert(Faqs).values(data).returning();
  
  return faq;
};

export const updateFaq = async (id: number, data: Partial<TNewFaq>) => {
  if (!db) throw new Error("Database connection not available");

  const [updated] = await db
    .update(Faqs)
    .set(data)
    .where(eq(Faqs.id, id))
    .returning();
  
  return updated;
};

export const getFaqById = async (id: number) => {
  if (!db) return null;

  return db.query.Faqs.findFirst({
    where: eq(Faqs.id, id),
  });
};

export const deleteFaq = async (id: number) => {
  if (!db) throw new Error("Database connection not available");

  await db.delete(Faqs).where(eq(Faqs.id, id));
};

