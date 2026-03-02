"use server";

import { and, count, eq, or } from "@repo/db";
import { db, NotificationRecipients } from "@repo/db";

import type { BookingNotificationType } from "./libs/email-templates";

import { safeDbQuery } from "./utils/db-error-handler";

import type { TNewNotificationRecipient } from "@repo/db";

type TGetRecipientsFilters = {
  limit?: number;
  page?: number;
  search?: string;
};

export const getNotificationRecipients = async (filters: TGetRecipientsFilters = {}) => {
  if (!db || !process.env.DATABASE_URL) {
    return { recipients: [], total: 0 };
  }

  const conditions = [];

  if (filters.search) {
    conditions.push(
      or(
        eq(NotificationRecipients.name, filters.search),
        eq(NotificationRecipients.email, filters.search),
      )
    );
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const totalResult = await safeDbQuery(
    async () => {
      const result = await db
        .select({ count: count() })
        .from(NotificationRecipients)
        .where(where);
      return result[0]?.count ?? 0;
    },
    0,
    "notification-recipients",
    "count query"
  );

  const total = typeof totalResult === "number" ? totalResult : 0;

  const page = Math.max(1, filters.page || 1);
  const limit = Math.max(1, filters.limit || 10);
  const offset = (page - 1) * limit;

  const recipients = await safeDbQuery(
    async () => {
      return await db.query.NotificationRecipients.findMany({
        limit,
        offset,
        orderBy: (r, { desc }) => [desc(r.created_at)],
        where,
      });
    },
    [],
    "notification-recipients",
    "findMany query"
  );

  return {
    recipients: recipients || [],
    total,
  };
};

const NOTIFICATION_TYPE_COLUMN_MAP: Record<BookingNotificationType, keyof typeof NotificationRecipients.$inferSelect> = {
  attraction_booking: "notify_attraction_bookings",
  booking: "notify_bookings",
  contact_query: "notify_contact_queries",
  event_booking: "notify_event_bookings",
  offer_booking: "notify_offer_bookings",
  room_booking: "notify_room_bookings",
};

export const getActiveRecipientsByType = async (type: BookingNotificationType) => {
  if (!db || !process.env.DATABASE_URL) return [];

  const column = NOTIFICATION_TYPE_COLUMN_MAP[type];
  if (!column) return [];

  const recipients = await safeDbQuery(
    async () => {
      return await db.query.NotificationRecipients.findMany({
        where: and(
          eq(NotificationRecipients.is_active, true),
          eq(NotificationRecipients[column] as any, true),
        ),
      });
    },
    [],
    "notification-recipients",
    `active recipients for ${type}`
  );

  return recipients || [];
};

export const createNotificationRecipient = async (data: Omit<TNewNotificationRecipient, "created_at" | "id" | "updated_at">) => {
  if (!db) throw new Error("Database connection not available");

  const [result] = await db
    .insert(NotificationRecipients)
    .values(data)
    .returning();

  return result;
};

export const updateNotificationRecipient = async (
  id: string,
  data: Partial<Omit<TNewNotificationRecipient, "created_at" | "id">>
) => {
  if (!db) throw new Error("Database connection not available");

  const [updated] = await db
    .update(NotificationRecipients)
    .set({ ...data, updated_at: new Date() })
    .where(eq(NotificationRecipients.id, id))
    .returning();

  return updated;
};

export const deleteNotificationRecipient = async (id: string) => {
  if (!db) throw new Error("Database connection not available");

  await db
    .delete(NotificationRecipients)
    .where(eq(NotificationRecipients.id, id));
};
