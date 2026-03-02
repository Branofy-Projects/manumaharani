import { Resend } from "resend";

let _resend: null | Resend = null;

export async function sendEmail({
  html,
  subject,
  to,
}: {
  html: string;
  subject: string;
  to: string | string[];
}) {
  const resend = getResend();
  const from = process.env.RESEND_FROM_EMAIL || "Manu Maharani <notifications@manumaharani.com>";

  const { data, error } = await resend.emails.send({
    from,
    html,
    subject,
    to: Array.isArray(to) ? to : [to],
  });

  if (error) {
    throw new Error(`Failed to send email: ${error.message}`);
  }

  return data;
}

function getResend(): Resend {
  if (!_resend) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error("RESEND_API_KEY is not set");
    }
    _resend = new Resend(apiKey);
  }
  return _resend;
}
