"use server";

import { and, asc, count, eq, gte, ilike } from "@repo/db";
import { db, EventFaqs, EventHighlights, EventImages, EventItinerary, Events } from "@repo/db";
import { revalidatePath } from "next/cache";

import { revalidateTags } from "./client.actions";
import { EVENTS_CACHE_KEY, getEventBySlugKey, LATEST_EVENTS_CACHE_KEY, UPCOMMING_EVENTS_CACHE_KEY } from "./libs/cache";
import { safeDbQuery } from "./utils/db-error-handler";

import type { TNewEvent } from "@repo/db/schema/events.schema";
import type { TOfferCategory } from "@repo/db/schema/offers.schema";
import type { TEvent, TEventWithDetails } from "@repo/db/schema/types.schema";

type TGetEventsFilters = {
  fromDate?: string;
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
        orderBy: (events, { asc }) => [asc(events.startDate)],
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

export const getEventById = async (id: string)=> {
  return db.query.Events.findFirst({
    where: eq(Events.id, id),
    with: {
      image: true,
    },
  }) 
};

export const getEventByIdWithDetails = async (id: string): Promise<TEventWithDetails | undefined> => {
  return db.query.Events.findFirst({
    where: eq(Events.id, id),
    with: {
      faqs: {
        orderBy: (faqs, { asc }) => [asc(faqs.order)],
        with: { faq: true },
      },
      highlights: {
        orderBy: (highlights, { asc }) => [asc(highlights.order)],
      },
      image: true,
      images: {
        orderBy: (images, { asc }) => [asc(images.order)],
        with: { image: true },
      },
      itinerary: {
        orderBy: (itinerary, { asc }) => [asc(itinerary.order)],
      },
    },
  }) as Promise<TEventWithDetails | undefined>;
};

export const getEventBySlug = async (slug: string): Promise<null | TEventWithDetails> => {
  const result = await safeDbQuery(
    async () => {
      return await db.query.Events.findFirst({
        where: eq(Events.slug, slug),
        with: {
          faqs: {
            orderBy: (faqs) => [asc(faqs.order)],
            with: { faq: true },
          },
          highlights: {
            orderBy: (highlights) => [asc(highlights.order)],
          },
          image: true,
          images: {
            orderBy: (images) => [asc(images.order)],
            with: { image: true },
          },
          itinerary: {
            orderBy: (itinerary) => [asc(itinerary.order)],
          },
        },
      });
    },
    null,
    "events",
    "findBySlug query"
  );
  return (result as TEventWithDetails) || null;
};

export const getRelatedEvents = async (
  currentEventId: string,
  category?: TOfferCategory,
  limit = 4
): Promise<TEvent[]> => {
  const conditions = [eq(Events.active, true)];

  if (category) {
    conditions.push(eq(Events.category, category));
  }

  const result = await safeDbQuery(
    async () => {
      const events = await db.query.Events.findMany({
        limit: limit + 1,
        orderBy: (events, { asc }) => [asc(events.startDate)],
        where: and(...conditions),
        with: { image: true },
      });
      return events.filter((event) => event.id !== currentEventId).slice(0, limit);
    },
    [],
    "events",
    "getRelatedEvents query"
  );

  return (result || []) as unknown as TEvent[];
};

export const createEvent = async (data: TNewEvent) => {
  const [event] = await db.insert(Events).values(data).returning();
  revalidatePath("/events");
  revalidateTags([EVENTS_CACHE_KEY, getEventBySlugKey(event.slug), LATEST_EVENTS_CACHE_KEY, UPCOMMING_EVENTS_CACHE_KEY])
  return event;
};

export const updateEvent = async (id: string, data: Partial<TNewEvent>) => {
  const [updated] = await db
    .update(Events)
    .set(data)
    .where(eq(Events.id, id))
    .returning();
  revalidatePath("/events");
  revalidatePath(`/events/${updated?.slug}`);
  revalidateTags([EVENTS_CACHE_KEY, getEventBySlugKey(updated.slug), LATEST_EVENTS_CACHE_KEY, UPCOMMING_EVENTS_CACHE_KEY])
  return updated;
};

export const deleteEvent = async (id: string) => {
  await db.delete(Events).where(eq(Events.id, id));
  revalidateTags([EVENTS_CACHE_KEY, LATEST_EVENTS_CACHE_KEY, UPCOMMING_EVENTS_CACHE_KEY])
  revalidatePath("/events");
};

// ==================== Highlights ====================
export const syncEventHighlights = async (
  eventId: string,
  highlights: Array<{ order?: number; text: string; type: "excluded" | "included" }>
) => {
  const event = await getEventById(eventId);
  if (!event) {
    throw new Error("Event not found");
  }

  await db.delete(EventHighlights).where(eq(EventHighlights.event_id, eventId));
  if (highlights.length > 0) {
    await db.insert(EventHighlights).values(
      highlights.map((h, index) => ({
        ...h,
        event_id: eventId,
        order: h.order ?? index,
      }))
    );
  }

  revalidatePath("/events");
  revalidatePath(`/events/${event.slug}`);
  revalidateTags([EVENTS_CACHE_KEY, getEventBySlugKey(event.slug), LATEST_EVENTS_CACHE_KEY, UPCOMMING_EVENTS_CACHE_KEY])
};

// ==================== Itinerary ====================
export const syncEventItinerary = async (
  eventId: string,
  itinerary: Array<{
    admission_included?: boolean;
    description?: string;
    duration?: string;
    is_stop?: boolean;
    location?: string;
    order?: number;
    title: string;
  }>
) => {
  const event = await getEventById(eventId);
  if (!event) {
    throw new Error("Event not found");
  }

  await db.delete(EventItinerary).where(eq(EventItinerary.event_id, eventId));
  if (itinerary.length > 0) {
    await db.insert(EventItinerary).values(
      itinerary.map((item, index) => ({
        ...item,
        event_id: eventId,
        order: item.order ?? index,
      }))
    );
  }

  revalidatePath("/events");
  revalidatePath(`/events/${event.slug}`);
  revalidateTags([EVENTS_CACHE_KEY, getEventBySlugKey(event.slug), LATEST_EVENTS_CACHE_KEY, UPCOMMING_EVENTS_CACHE_KEY])
};

// ==================== Gallery Images ====================
export const syncEventImages = async (
  eventId: string,
  images: Array<{ caption?: string; image_id: number; order?: number }>
) => {
  const event = await getEventById(eventId);
  if (!event) {
    throw new Error("Event not found");
  }

  await db.delete(EventImages).where(eq(EventImages.event_id, eventId));
  if (images.length > 0) {
    await db.insert(EventImages).values(
      images.map((img, index) => ({
        ...img,
        event_id: eventId,
        order: img.order ?? index,
      }))
    );
  }

  revalidatePath("/events");
  revalidatePath(`/events/${event.slug}`);
  revalidateTags([EVENTS_CACHE_KEY, getEventBySlugKey(event.slug), LATEST_EVENTS_CACHE_KEY, UPCOMMING_EVENTS_CACHE_KEY])
};

// ==================== FAQs ====================
export const syncEventFaqs = async (
  eventId: string,
  faqs: Array<{ faq_id: number; order?: number }>
) => {
  const event = await getEventById(eventId);
  if (!event) {
    throw new Error("Event not found");
  }

  await db.delete(EventFaqs).where(eq(EventFaqs.event_id, eventId));
  if (faqs.length > 0) {
    await db.insert(EventFaqs).values(
      faqs.map((f, index) => ({
        ...f,
        event_id: eventId,
        order: f.order ?? index,
      }))
    );
  }

  revalidatePath("/events");
  revalidatePath(`/events/${event.slug}`);
  revalidateTags([EVENTS_CACHE_KEY, getEventBySlugKey(event.slug), LATEST_EVENTS_CACHE_KEY, UPCOMMING_EVENTS_CACHE_KEY])
};
