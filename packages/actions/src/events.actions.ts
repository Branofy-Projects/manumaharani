"use server";

import { and, count, eq, gte, ilike } from "@repo/db";
import { db, Events } from "@repo/db";
import { revalidatePath } from "next/cache";

import { safeDbQuery } from "./utils/db-error-handler";

import type { TNewEvent } from "@repo/db/schema/events.schema";
import type { TEvent } from "@repo/db/schema/types.schema";

type TGetEventsFilters = {
  fromDate?: string; // Add this optional field
  limit?: number;
  page?: number;
  search?: string;
  upcomingOnly?: boolean;
};

export const getEvents = async (filters: TGetEventsFilters = {}) => {
  const conditions = [];

  if (filters.search) {
    conditions.push(ilike(Events.name, `%${filters.search}%`));
  }

  if (filters.upcomingOnly) {
    const today = filters.fromDate || new Date().toISOString().split("T")[0];
    conditions.push(gte(Events.startDate, today));
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const totalResult = await safeDbQuery(
    async () => {
      const result = await db
        .select({ count: count() })
        .from(Events)
        .where(where);
      return result[0]?.count ?? 0;
    },
    0,
    "events",
    "count query"
  );

  const total = typeof totalResult === "number" ? totalResult : 0;

  const page = Math.max(1, filters.page || 1);
  const limit = Math.max(1, filters.limit || 10);
  const offset = (page - 1) * limit;

  const events = await safeDbQuery(
    async () => {
      return await db.query.Events.findMany({
        limit,
        offset,
        orderBy: (events, { desc }) => [desc(events.startDate)],
        where,
        with: {
          image: true,
        },
      });
    },
    [],
    "events",
    "findMany query"
  );

  return {
    events: (events || []) as unknown as TEvent[],
    total,
  };
};

export const getEventById = async (id: string): Promise<TEvent | undefined> => {
  return db.query.Events.findFirst({
    where: eq(Events.id, id),
    with: {
      image: true,
    },
  }) as Promise<TEvent | undefined>;
};

export const createEvent = async (data: TNewEvent) => {
  const [event] = await db.insert(Events).values(data).returning();
  revalidatePath("/events");
  return event;
};

export const updateEvent = async (id: string, data: Partial<TNewEvent>) => {
  const [updated] = await db
    .update(Events)
    .set(data)
    .where(eq(Events.id, id))
    .returning();
  revalidatePath("/events");
  return updated;
};

export const deleteEvent = async (id: string) => {
  await db.delete(Events).where(eq(Events.id, id));
  revalidatePath("/events");
};
