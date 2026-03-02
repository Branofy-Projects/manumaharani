export type BookingNotificationType =
  | "attraction_booking"
  | "booking"
  | "contact_query"
  | "event_booking"
  | "offer_booking"
  | "room_booking";

export type BookingDetail = {
  label: string;
  value: string;
};

export type BookingEmailParams = {
  details: BookingDetail[];
  guestEmail: string;
  guestMessage?: string;
  guestName: string;
  guestPhone: string;
  type: BookingNotificationType;
};

const TITLES: Record<BookingNotificationType, string> = {
  attraction_booking: "New Attraction Inquiry",
  booking: "New Booking",
  contact_query: "New Contact Query",
  event_booking: "New Event Inquiry",
  offer_booking: "New Offer Inquiry",
  room_booking: "New Room Inquiry",
};

export function buildBookingEmailHtml(params: BookingEmailParams): string {
  const { details, guestEmail, guestMessage, guestName, guestPhone, type } = params;
  const title = TITLES[type];
  const baseUrl = process.env.NEXT_PUBLIC_CLIENT_URL || "https://manumaharani.com";
  const logoUrl = `${baseUrl}/Logo-Manu-Maharani.png`;

  const detailRows = details
    .map(
      (d) => `
      <tr>
        <td style="padding: 8px 12px; color: #666; font-size: 14px; border-bottom: 1px solid #f0f0f0; width: 40%;">${d.label}</td>
        <td style="padding: 8px 12px; color: #333; font-size: 14px; border-bottom: 1px solid #f0f0f0; font-weight: 500;">${d.value}</td>
      </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f5f1eb; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f1eb; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">

          <!-- Header with gold bar -->
          <tr>
            <td style="background-color: #b68833; padding: 24px 32px; text-align: center;">
              <img src="${logoUrl}" alt="Manu Maharani Resort & Spa" width="180" style="max-width: 180px; height: auto; display: block; margin: 0 auto;" />
            </td>
          </tr>

          <!-- Title -->
          <tr>
            <td style="padding: 28px 32px 16px; text-align: center;">
              <h1 style="margin: 0; font-size: 22px; font-weight: 600; color: #313131; letter-spacing: 0.5px;">${title}</h1>
              <p style="margin: 8px 0 0; font-size: 13px; color: #999;">Received on ${new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })} at ${new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</p>
            </td>
          </tr>

          <!-- Guest Info -->
          <tr>
            <td style="padding: 0 32px 20px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #faf8f5; border-radius: 6px; overflow: hidden;">
                <tr>
                  <td style="padding: 16px 16px 8px;">
                    <p style="margin: 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #b68833; font-weight: 600;">Guest Information</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 0 16px 16px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 6px 0; color: #666; font-size: 14px; width: 80px;">Name</td>
                        <td style="padding: 6px 0; color: #333; font-size: 14px; font-weight: 600;">${escapeHtml(guestName)}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; color: #666; font-size: 14px;">Email</td>
                        <td style="padding: 6px 0; color: #333; font-size: 14px;"><a href="mailto:${escapeHtml(guestEmail)}" style="color: #b68833; text-decoration: none;">${escapeHtml(guestEmail)}</a></td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; color: #666; font-size: 14px;">Phone</td>
                        <td style="padding: 6px 0; color: #333; font-size: 14px;"><a href="tel:${escapeHtml(guestPhone)}" style="color: #b68833; text-decoration: none;">${escapeHtml(guestPhone)}</a></td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          ${
            details.length > 0
              ? `<!-- Booking Details -->
          <tr>
            <td style="padding: 0 32px 20px;">
              <p style="margin: 0 0 8px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #b68833; font-weight: 600;">Booking Details</p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #f0f0f0; border-radius: 6px; overflow: hidden;">
                ${detailRows}
              </table>
            </td>
          </tr>`
              : ""
          }

          ${
            guestMessage
              ? `<!-- Message -->
          <tr>
            <td style="padding: 0 32px 24px;">
              <p style="margin: 0 0 8px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #b68833; font-weight: 600;">Message</p>
              <div style="background-color: #faf8f5; border-radius: 6px; padding: 16px; border-left: 3px solid #b68833;">
                <p style="margin: 0; font-size: 14px; color: #555; line-height: 1.6; white-space: pre-wrap;">${escapeHtml(guestMessage)}</p>
              </div>
            </td>
          </tr>`
              : ""
          }

          <!-- Footer -->
          <tr>
            <td style="background-color: #313131; padding: 20px 32px; text-align: center;">
              <p style="margin: 0 0 4px; font-size: 13px; color: #ccc;">Manu Maharani Resort & Spa</p>
              <a href="${baseUrl}" style="font-size: 12px; color: #b68833; text-decoration: none;">${baseUrl}</a>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
