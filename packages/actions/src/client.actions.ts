"use server";

import { auth } from "@repo/auth/auth.config";
import { createHmac } from "crypto";
import { headers } from "next/headers";

import { AppResponseHandler } from "./utils/app-response-handler";

export const revalidateTags = async (tags: string[]) => {
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });

  const body = JSON.stringify({ tags });
  const signature = createHmac("sha256", process.env.ADMIN_WEBHOOK_SECRET!)
    .update(body)
    .digest("hex");

  const clientUrl =
    process.env.NEXT_PUBLIC_CLIENT_URL || "http://localhost:3000";

  try {
    const response = await fetch(`${clientUrl}/api/revalidate-tags`, {
      body,
      headers: {
        Authorization: `Bearer ${session?.session.token}`,
        "Content-Type": "application/json",
        "x-webhook-signature": `sha256=${signature}`,
      },
      method: "POST",
    });
    return response.json();
  } catch (error) {
    console.error("Error revalidating tags", error);
    return AppResponseHandler.error("Failed to revalidate tags", 500);
  }
};
