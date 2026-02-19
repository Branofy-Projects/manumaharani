import { auth } from "@repo/auth/auth.config";
import { NextRequest, NextResponse } from "next/server";

import { bucket } from "@/lib/gcs";

import type { GetFilesOptions } from "@google-cloud/storage";

export const runtime = "nodejs";

const BUCKET_NAME = process.env.GCP_BUCKET_NAME!;
const IMAGE_EXTENSIONS = new Set(["webp", "jpg", "jpeg", "png", "avif", "svg", "gif"]);

interface StaticImage {
  name: string;
  size: number;
  updated: string;
  url: string;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const perPage = Math.min(100, Math.max(1, Number(searchParams.get("perPage")) || 20));
    const sort = searchParams.get("sort") === "asc" ? "asc" : "desc";
    const dateFrom = searchParams.get("dateFrom") || "";
    const dateTo = searchParams.get("dateTo") || "";

    // Use GCS getFiles options for filtering
    // File names follow the pattern: static/{timestamp}-{name}.webp
    // Since names are timestamp-prefixed, startOffset/endOffset filter by date range
    const options: GetFilesOptions = {
      matchGlob: "static/*.{webp,jpg,jpeg,png,avif,svg,gif}",
      prefix: "static/",
    };

    if (dateFrom) {
      const from = new Date(dateFrom);
      from.setHours(0, 0, 0, 0);
      options.startOffset = `static/${from.getTime()}`;
    }

    if (dateTo) {
      const to = new Date(dateTo);
      to.setHours(23, 59, 59, 999);
      // endOffset is exclusive, so add 1ms to include the whole end day
      options.endOffset = `static/${to.getTime() + 1}`;
    }

    const [files] = await bucket().getFiles(options);

    const images: StaticImage[] = files
      .filter((file) => {
        if (file.name === "static/") return false;
        const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
        return IMAGE_EXTENSIONS.has(ext);
      })
      .map((file) => ({
        name: file.name.replace("static/", ""),
        size: Number(file.metadata.size || 0),
        updated: file.metadata.updated || new Date().toISOString(),
        url: `https://storage.googleapis.com/${BUCKET_NAME}/${file.name}`,
      }));

    // GCS returns files in ascending lexicographic order (= ascending date for timestamp-prefixed names)
    // Reverse for descending sort
    if (sort === "desc") {
      images.reverse();
    }

    // Paginate
    const total = images.length;
    const totalPages = Math.ceil(total / perPage);
    const start = (page - 1) * perPage;
    const paginated = images.slice(start, start + perPage);

    return NextResponse.json({
      data: paginated,
      page,
      perPage,
      success: true,
      total,
      totalPages,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to list images";
    console.error("List static images error:", error);
    return NextResponse.json(
      { error: message, success: false },
      { status: 500 }
    );
  }
}

// Returns a signed URL for direct client-to-GCS upload
export async function POST(req: NextRequest) {
  try {
    const { contentType, fileName } = await req.json();

    if (!fileName || typeof fileName !== "string") {
      return NextResponse.json(
        { error: "fileName is required", success: false },
        { status: 400 }
      );
    }

    const safeName = fileName.replace(/[^a-zA-Z0-9_.-]/g, "_");
    const destination = `static/${Date.now()}-${safeName}`;
    const file = bucket().file(destination);

    const [signedUrl] = await file.getSignedUrl({
      action: "write",
      contentType: contentType || "image/webp",
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
      version: "v4",
    });

    const publicUrl = `https://storage.googleapis.com/${BUCKET_NAME}/${destination}`;

    return NextResponse.json({
      publicUrl,
      signedUrl,
      success: true,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to generate upload URL";
    console.error("Signed URL generation error:", error);
    return NextResponse.json(
      { error: message, success: false },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized", success: false },
        { status: 401 }
      );
    }

    if (session.user.userRole !== "super_admin") {
      return NextResponse.json(
        { error: "Only super admins can delete static images", success: false },
        { status: 403 }
      );
    }

    const { fileName } = await req.json();
    if (!fileName || typeof fileName !== "string") {
      return NextResponse.json(
        { error: "fileName is required", success: false },
        { status: 400 }
      );
    }

    const safeName = fileName.replace(/\.\./g, "").replace(/^\//, "");
    const filePath = `static/${safeName}`;

    await bucket().file(filePath).delete({ ignoreNotFound: true });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Delete failed";
    console.error("Delete static image error:", error);
    return NextResponse.json(
      { error: message, success: false },
      { status: 500 }
    );
  }
}
