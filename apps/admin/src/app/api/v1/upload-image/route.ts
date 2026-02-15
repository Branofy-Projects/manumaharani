import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import sharp from "sharp";

import { bucket } from "@/lib/gcs";

export const runtime = "nodejs";

const IMAGE_SIZES = {
  large: { height: null as null | number, suffix: "_lg", width: 1024 },
  medium: { height: null as null | number, suffix: "_md", width: 768 },
  original: {
    height: null as null | number,
    suffix: "",
    width: null as null | number,
  },
  small: { height: null as null | number, suffix: "_sm", width: 480 },
} as const;

type ImageSize = keyof typeof IMAGE_SIZES;

interface ImageVariant {
  height?: number;
  size: ImageSize;
  url: string;
  width?: number;
}

interface UploadResult {
  originalName: string;
  variants: ImageVariant[];
}

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const isChunked = searchParams.get("chunked") === "1";

    if (!isChunked) {
      const form = await req.formData();
      const file = form.get("file") as File | null;
      if (!file) {
        return NextResponse.json(
          { error: "No file provided", success: false },
          { status: 400 }
        );
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        return NextResponse.json(
          { error: "File must be an image", success: false },
          { status: 400 }
        );
      }

      const result = await uploadAndMakeVariantsFromFile(file);
      return NextResponse.json({ data: result, success: true });
    }

    const form = await req.formData();
    const chunk = form.get("chunk") as File | null;
    const name = (form.get("name") as string) || "";
    const sizeStr = (form.get("size") as string) || "";
    const indexStr =
      (form.get("index") as string) || (form.get("start") as string) || "";
    const totalStr = (form.get("total") as string) || "";

    if (!chunk || !name || !sizeStr || !totalStr || !indexStr) {
      return NextResponse.json(
        { error: "Missing chunk upload fields", success: false },
        { status: 400 }
      );
    }

    const size = Number(sizeStr);
    const total = Number(totalStr);
    const index = Number(indexStr);
    if (
      !Number.isFinite(size) ||
      !Number.isFinite(total) ||
      !Number.isFinite(index)
    ) {
      return NextResponse.json(
        { error: "Invalid numeric fields", success: false },
        { status: 400 }
      );
    }

    const sessionId = getSessionId(name, size);
    const chunkBuf = Buffer.from(await chunk.arrayBuffer());
    await saveChunk(sessionId, index, chunkBuf);

    if (index === total - 1) {
      const composedKey = `uploads/raw/${Date.now()}-${path.basename(name)}`;
      await composeChunks(sessionId, total, composedKey);

      const [composedBuffer] = await bucket().file(composedKey).download();
      const result = await uploadAndMakeVariantsFromBuffer(
        composedBuffer,
        name
      );

      await cleanupChunks(sessionId, total);
      await bucket()
        .file(composedKey)
        .delete({ ignoreNotFound: true })
        .catch(() => {});

      return NextResponse.json({ composed: true, data: result, success: true });
    }

    return NextResponse.json({ received: index, success: true });
  } catch (error: any) {
    console.error("Upload error:", error);
    console.error("Error stack:", error?.stack);
    console.error("Error details:", {
      code: error?.code,
      message: error?.message,
      name: error?.name,
    });

    // Provide more helpful error messages
    let errorMessage = error?.message || "Upload failed";

    // Check for common issues
    if (errorMessage.includes("GCP_BUCKET_NAME")) {
      errorMessage =
        "GCS bucket name is not configured. Please set GCP_BUCKET_NAME in your .env file.";
    } else if (errorMessage.includes("GCS credentials")) {
      errorMessage =
        "GCS credentials are missing. Please configure GCP_PROJECT_ID, GCP_CLIENT_EMAIL, and GCP_PRIVATE_KEY in your .env file.";
    } else if (
      errorMessage.includes("Permission denied") ||
      error?.code === 403
    ) {
      errorMessage =
        "GCS permission denied. Please check that your service account has Storage Admin role.";
    } else if (errorMessage.includes("not found") || error?.code === 404) {
      errorMessage = `GCS bucket '${process.env.GCP_BUCKET_NAME}' not found. Please verify the bucket name.`;
    }

    return NextResponse.json(
      { error: errorMessage, success: false },
      { status: 500 }
    );
  }
}

async function cleanupChunks(sessionId: string, total: number) {
  const deletions = Array.from({ length: total }, (_, i) =>
    bucket()
      .file(`uploads/chunks/${sessionId}/${i}`)
      .delete({ ignoreNotFound: true })
  );
  await Promise.allSettled(deletions);
}

async function composeChunks(
  sessionId: string,
  total: number,
  composedKey: string
) {
  const sources = Array.from({ length: total }, (_, i) =>
    bucket().file(`uploads/chunks/${sessionId}/${i}`)
  );
  await bucket().combine(sources, bucket().file(composedKey));
}

function getSessionId(name: string, size: number) {
  const h = crypto
    .createHash("sha256")
    .update(`${size}:${name}`)
    .digest("hex")
    .slice(0, 40);
  return `${size}-${h}`;
}

async function processImage(buffer: Buffer, size: ImageSize) {
  const { height, width } = IMAGE_SIZES[size];
  let inst = sharp(buffer);

  if (width || height) {
    inst = inst.resize({
      fit: "inside",
      height: height ?? undefined,
      width: width ?? undefined,
      withoutEnlargement: true,
    });
  }

  // Use higher quality for original to preserve detail
  const quality = size === "original" ? 92 : 85;

  const { data, info } = await inst
    .webp({ quality })
    .toBuffer({ resolveWithObject: true });
  return { buffer: data, metadata: info };
}

function publicGcsUrl(destination: string) {
  return `https://storage.googleapis.com/${process.env.GCP_BUCKET_NAME}/${destination}`;
}

async function saveChunk(sessionId: string, index: number, chunkBuf: Buffer) {
  const key = `uploads/chunks/${sessionId}/${index}`;
  await bucket()
    .file(key)
    .save(chunkBuf, {
      metadata: { contentType: "application/octet-stream" },
      resumable: false,
    });
  return key;
}

function tsName(base: string, suffix: string) {
  const nameWithoutExt = base.split(".").slice(0, -1).join(".") || base;
  const timestamp = Date.now();
  return suffix
    ? `${timestamp}-${nameWithoutExt}${suffix}.webp`
    : `${timestamp}-${nameWithoutExt}.webp`;
}

async function uploadAndMakeVariantsFromBuffer(
  input: Buffer,
  originalName: string
): Promise<UploadResult> {
  const variants: ImageVariant[] = [];
  const errors: string[] = [];

  // Check GCS configuration first
  if (!process.env.GCP_BUCKET_NAME) {
    throw new Error("GCP_BUCKET_NAME environment variable is not set");
  }

  if (
    !process.env.GCP_PROJECT_ID ||
    !process.env.GCP_CLIENT_EMAIL ||
    !process.env.GCP_PRIVATE_KEY
  ) {
    throw new Error(
      "GCS credentials are not configured. Please check GCP_PROJECT_ID, GCP_CLIENT_EMAIL, and GCP_PRIVATE_KEY environment variables"
    );
  }

  for (const [key, cfg] of Object.entries(IMAGE_SIZES)) {
    const size = key as ImageSize;
    try {
      const { buffer, metadata } = await processImage(input, size);
      const fileName = tsName(originalName, cfg.suffix);
      const destination = `uploads/${fileName}`;

      try {
        await bucket().file(destination).save(buffer, {
          contentType: "image/webp",
          resumable: false,
        });
        const url = publicGcsUrl(destination);
        variants.push({
          height: metadata.height,
          size,
          url,
          width: metadata.width,
        });
      } catch (gcsError: any) {
        const errorMsg = `GCS upload failed for ${size}: ${gcsError?.message || String(gcsError)}`;
        console.error(errorMsg, gcsError);
        errors.push(errorMsg);

        // Check for common GCS errors
        if (gcsError?.code === 403) {
          errors.push(
            "GCS Permission denied. Check service account permissions."
          );
        } else if (gcsError?.code === 404) {
          errors.push(`GCS Bucket '${process.env.GCP_BUCKET_NAME}' not found.`);
        }
      }
    } catch (e: any) {
      const errorMsg = `Image processing failed for ${size}: ${e?.message || String(e)}`;
      console.error(errorMsg, e);
      errors.push(errorMsg);
    }
  }

  if (variants.length === 0) {
    const errorDetails =
      errors.length > 0
        ? ` Errors: ${errors.join("; ")}`
        : " Check GCS configuration and permissions.";
    throw new Error(`Failed to process any image variants.${errorDetails}`);
  }

  return { originalName, variants };
}

async function uploadAndMakeVariantsFromFile(
  file: File
): Promise<UploadResult> {
  if (!file.type.startsWith("image/")) {
    throw new Error("File must be an image");
  }
  const input = Buffer.from(await file.arrayBuffer());
  return uploadAndMakeVariantsFromBuffer(input, file.name);
}
