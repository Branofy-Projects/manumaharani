import { NextResponse } from "next/server";

// Temporary debug route — DELETE after verifying env vars
export async function GET() {
  const keys = [
    "DATABASE_URL",
    "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
    "CLERK_SECRET_KEY",
    "GCP_PROJECT_ID",
    "GCP_CLIENT_EMAIL",
    "GCP_PRIVATE_KEY",
    "GCP_BUCKET_NAME",
    "UPSTASH_REDIS_REST_URL",
    "UPSTASH_REDIS_REST_TOKEN",
    "REVALIDATION_SECRET",
    "BETTER_AUTH_SECRET",
    "NEXT_PUBLIC_AUTH_URL",
    "NEXT_PUBLIC_BASE_URL",
    "NEXT_PUBLIC_CLIENT_URL",
    "NEXT_PUBLIC_ADMIN_URL",
    "ADMIN_WEBHOOK_SECRET",
    "PORT",
    "NODE_ENV",
  ];

  const status = keys.reduce(
    (acc, key) => {
      const val = process.env[key];
      acc[key] = val ? `SET (${val.substring(0, 4)}...)` : "MISSING";
      return acc;
    },
    {} as Record<string, string>
  );

  return NextResponse.json(status, { status: 200 });
}
