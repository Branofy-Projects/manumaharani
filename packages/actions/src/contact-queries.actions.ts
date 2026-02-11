"use server";

import { and, count, eq, or } from "@repo/db";
import { ContactQueries, db } from "@repo/db";

import { safeDbQuery } from "./utils/db-error-handler";

import type { TNewContactQuery } from "@repo/db/schema/contact-queries.schema";

type TGetContactQueriesFilters = {
  limit?: number;
  page?: number;
  search?: string;
  status?: string;
};

export const getContactQueries = async (filters: TGetContactQueriesFilters = {}) => {
  if (!db || !process.env.DATABASE_URL) {
    return { contactQueries: [], total: 0 };
  }

  const conditions = [];

  if (filters.search) {
    conditions.push(
      or(
        eq(ContactQueries.name, filters.search),
        eq(ContactQueries.email, filters.search),
        eq(ContactQueries.phone, filters.search)
      )
    );
  }

  if (filters.status) {
    conditions.push(eq(ContactQueries.status, filters.status as any));
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const totalResult = await safeDbQuery(
    async () => {
      const result = await db
        .select({ count: count() })
        .from(ContactQueries)
        .where(where);
      return result[0]?.count ?? 0;
    },
    0,
    "contact-queries",
    "count query"
  );

  const total = typeof totalResult === "number" ? totalResult : 0;

  const page = Math.max(1, filters.page || 1);
  const limit = Math.max(1, filters.limit || 10);
  const offset = (page - 1) * limit;

  const contactQueries = await safeDbQuery(
    async () => {
      return await db.query.ContactQueries.findMany({
        limit,
        offset,
        orderBy: (queries, { desc }) => [desc(queries.created_at)],
        where,
      });
    },
    [],
    "contact-queries",
    "findMany query"
  );

  return {
    contactQueries: contactQueries || [],
    total,
  };
};

export const updateContactQueryStatus = async (
  id: string,
  status: "closed" | "contacted" | "pending" | "resolved",
) => {
  try {
    if (!db) throw new Error("Database connection not available");

    const [updated] = await db
      .update(ContactQueries)
      .set({
        status,
        updated_at: new Date(),
      })
      .where(eq(ContactQueries.id, id))
      .returning();

    return updated;
  } catch (error) {
    console.error("Error updating contact query status:", error);
    throw error;
  }
};

export const createContactQuery = async (data: {
  email: string;
  message: string;
  name: string;
  phone: string;
  subject: string;
}) => {
  if (!db) throw new Error("Database connection not available");

  const query = await safeDbQuery(
    async () => {
      const [result] = await db
        .insert(ContactQueries)
        .values({
          email: data.email,
          message: data.message,
          name: data.name,
          phone: data.phone,
          subject: data.subject,
        } satisfies TNewContactQuery)
        .returning();
      return result;
    },
    null,
    "contact-queries",
    "create contact query"
  );

  if (!query) {
    throw new Error("Failed to create contact query");
  }

  return query;
};
