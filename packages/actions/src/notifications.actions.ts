"use server";

import type { BookingEmailParams, BookingNotificationType } from "./libs/email-templates";

import { sendEmail } from "./libs/email";
import { buildBookingEmailHtml } from "./libs/email-templates";
import { getActiveRecipientsByType } from "./notification-recipients.actions";

const SUBJECT_MAP: Record<BookingNotificationType, string> = {
  attraction_booking: "New Attraction Inquiry",
  booking: "New Booking Received",
  contact_query: "New Contact Query",
  event_booking: "New Event Inquiry",
  offer_booking: "New Offer Inquiry",
  room_booking: "New Room Inquiry",
};

/**
 * Send email notification to all active recipients for the given booking type.
 * This is designed to be called with `void notifyNewBooking(...)` so it doesn't
 * block the booking creation flow. Errors are logged but never thrown.
 */
export async function notifyNewBooking(
  params: BookingEmailParams
) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.warn("[notifications] RESEND_API_KEY not set, skipping email notification");
      return;
    }

    const recipients = await getActiveRecipientsByType(params.type);
    if (recipients.length === 0) return;

    const emails = recipients.map((r) => r.email);
    const html = buildBookingEmailHtml(params);
    const subject = SUBJECT_MAP[params.type];

    await sendEmail({
      html,
      subject,
      to: emails,
    });
  } catch (error) {
    console.error("[notifications] Failed to send booking notification email:", error);
  }
}
