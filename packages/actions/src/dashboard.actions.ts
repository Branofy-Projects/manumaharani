"use server";

import { and, count, desc, eq, gte, sql } from "@repo/db";
import { ContactQueries, db, OfferBookings } from "@repo/db";

import { safeDbQuery } from "./utils/db-error-handler";

export const getDashboardStats = async () => {
  if (!db || !process.env.DATABASE_URL) {
    return {
      contactQueries: { pending: 0, today: 0, total: 0 },
      offerBookings: { pending: 0, today: 0, total: 0 },
    };
  }

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const [
    totalContactQueries,
    todayContactQueries,
    pendingContactQueries,
    totalOfferBookings,
    todayOfferBookings,
    pendingOfferBookings,
  ] = await Promise.all([
    // Contact queries total
    safeDbQuery(
      async () => {
        const result = await db.select({ count: count() }).from(ContactQueries);
        return result[0]?.count ?? 0;
      },
      0, "dashboard", "total contact queries"
    ),
    // Contact queries today
    safeDbQuery(
      async () => {
        const result = await db
          .select({ count: count() })
          .from(ContactQueries)
          .where(gte(ContactQueries.created_at, todayStart));
        return result[0]?.count ?? 0;
      },
      0, "dashboard", "today contact queries"
    ),
    // Contact queries pending
    safeDbQuery(
      async () => {
        const result = await db
          .select({ count: count() })
          .from(ContactQueries)
          .where(eq(ContactQueries.status, "pending"));
        return result[0]?.count ?? 0;
      },
      0, "dashboard", "pending contact queries"
    ),
    // Offer bookings total
    safeDbQuery(
      async () => {
        const result = await db.select({ count: count() }).from(OfferBookings);
        return result[0]?.count ?? 0;
      },
      0, "dashboard", "total offer bookings"
    ),
    // Offer bookings today
    safeDbQuery(
      async () => {
        const result = await db
          .select({ count: count() })
          .from(OfferBookings)
          .where(gte(OfferBookings.created_at, todayStart));
        return result[0]?.count ?? 0;
      },
      0, "dashboard", "today offer bookings"
    ),
    // Offer bookings pending
    safeDbQuery(
      async () => {
        const result = await db
          .select({ count: count() })
          .from(OfferBookings)
          .where(eq(OfferBookings.status, "pending"));
        return result[0]?.count ?? 0;
      },
      0, "dashboard", "pending offer bookings"
    ),
  ]);

  return {
    contactQueries: {
      pending: typeof pendingContactQueries === "number" ? pendingContactQueries : 0,
      today: typeof todayContactQueries === "number" ? todayContactQueries : 0,
      total: typeof totalContactQueries === "number" ? totalContactQueries : 0,
    },
    offerBookings: {
      pending: typeof pendingOfferBookings === "number" ? pendingOfferBookings : 0,
      today: typeof todayOfferBookings === "number" ? todayOfferBookings : 0,
      total: typeof totalOfferBookings === "number" ? totalOfferBookings : 0,
    },
  };
};

export const getRecentEnquiries = async (limit = 5) => {
  if (!db || !process.env.DATABASE_URL) {
    return { contactQueries: [], offerBookings: [] };
  }

  const [recentContactQueries, recentOfferBookings] = await Promise.all([
    safeDbQuery(
      async () => {
        return await db.query.ContactQueries.findMany({
          limit,
          orderBy: (q, { desc }) => [desc(q.created_at)],
        });
      },
      [], "dashboard", "recent contact queries"
    ),
    safeDbQuery(
      async () => {
        return await db.query.OfferBookings.findMany({
          limit,
          orderBy: (b, { desc }) => [desc(b.created_at)],
          with: { offer: true },
        });
      },
      [], "dashboard", "recent offer bookings"
    ),
  ]);

  return {
    contactQueries: recentContactQueries || [],
    offerBookings: recentOfferBookings || [],
  };
};
