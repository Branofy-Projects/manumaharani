import { authHelpers } from "@repo/auth";
import { auth } from "@repo/auth/auth.config";
import { createHmac } from "crypto";
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("x-webhook-signature");

  const expectedSignature = createHmac(
    "sha256",
    process.env.ADMIN_WEBHOOK_SECRET!,
  )
    .update(body, "utf-8")
    .digest("hex");

  if (!signature || signature !== `sha256=${expectedSignature}`) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const headersObj = Object.fromEntries(headersList.entries());
  const session = await auth.api.getSession({
    headers: headersObj,
  });

  if (!session || (session && !authHelpers.isAdmin(session.user.userRole as any))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { tags } = JSON.parse(body);

  for (const tag of tags) {
    revalidateTag(tag, "max");
  }

  return NextResponse.json({ message: "Tags revalidated" });
};
