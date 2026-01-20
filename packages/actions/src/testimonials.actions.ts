"use server";
import { and, count, eq, ilike } from "@repo/db";
import { db, Testimonials } from "@repo/db";
import type { TNewTestimonial, TTestimonial } from "@repo/db";

import { bumpVersion } from "./libs/cache";
import { safeDbQuery } from "./utils/db-error-handler";

type TGetTestimonialsFilters = {
  search?: string;
  page?: number;
  limit?: number;
  status?: "pending" | "approved" | "rejected";
};

export const getTestimonials = async (filters: TGetTestimonialsFilters = {}) => {
  if (!db || !process.env.DATABASE_URL) {
    return { testimonials: [], total: 0 };
  }

  const conditions = [];
  
  if (filters.search) {
    conditions.push(
      ilike(Testimonials.guest_name, `%${filters.search}%`)
    );
  }
  
  if (filters.status) {
    conditions.push(eq(Testimonials.status, filters.status));
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const totalResult = await safeDbQuery(
    async () => {
      const result = await db
        .select({ count: count() })
        .from(Testimonials)
        .where(where);
      return result[0]?.count ?? 0;
    },
    0,
    "testimonials",
    "count query"
  );

  const total = typeof totalResult === "number" ? totalResult : 0;

  const page = Math.max(1, filters.page || 1);
  const limit = Math.max(1, filters.limit || 10);
  const offset = (page - 1) * limit;

  const testimonials = await safeDbQuery(
    async () => {
      return await db.query.Testimonials.findMany({
        where,
        limit,
        offset,
        with: {
          guestAvatar: true,
          user: true,
        },
        orderBy: (testimonials, { desc }) => [desc(testimonials.created_at)],
      });
    },
    [],
    "testimonials",
    "findMany query"
  );

  return {
    testimonials: (testimonials || []) as unknown as TTestimonial[],
    total,
  };
};

export const getTestimonialById = async (id: number) => {
  try {
    if (!db) return null;

    return await db.query.Testimonials.findFirst({
      where: eq(Testimonials.id, id),
      with: {
        guestAvatar: true,
        user: true,
      },
    });
  } catch (error) {
    console.error("Error fetching testimonial by ID:", error);
    return null;
  }
};

export const createTestimonial = async (data: TNewTestimonial) => {
  try {
    if (!db) throw new Error("Database connection not available");

    const [testimonial] = await db.insert(Testimonials).values(data).returning();
    
    await bumpVersion("testimonials");
    
    return testimonial;
  } catch (error) {
    console.error("Error creating testimonial:", error);
    throw error;
  }
};

export const updateTestimonial = async (id: number, data: Partial<TNewTestimonial>) => {
  try {
    if (!db) throw new Error("Database connection not available");

    const [updated] = await db
      .update(Testimonials)
      .set({ ...data, updated_at: new Date() })
      .where(eq(Testimonials.id, id))
      .returning();
    
    await bumpVersion("testimonials");
    
    return updated;
  } catch (error) {
    console.error("Error updating testimonial:", error);
    throw error;
  }
};

export const deleteTestimonial = async (id: number) => {
  try {
    if (!db) throw new Error("Database connection not available");

    await db.delete(Testimonials).where(eq(Testimonials.id, id));
    
    await bumpVersion("testimonials");
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    throw error;
  }
};

