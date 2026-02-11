import { NextRequest, NextResponse } from "next/server";

import { bucket } from "@/lib/gcs";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided", success: false },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("video/")) {
      return NextResponse.json(
        { error: "File must be a video", success: false },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const destination = `uploads/reels/${Date.now()}-${file.name}`;

    await bucket().file(destination).save(buffer, {
      contentType: file.type,
      resumable: buffer.length > 5 * 1024 * 1024,
    });

    const url = publicGcsUrl(destination);

    return NextResponse.json({ success: true, url });
  } catch (error: any) {
    console.error("Video upload error:", error);
    return NextResponse.json(
      { error: error?.message || "Upload failed", success: false },
      { status: 500 }
    );
  }
}

function publicGcsUrl(destination: string) {
  return `https://storage.googleapis.com/${process.env.GCP_BUCKET_NAME}/${destination}`;
}
