import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import sharp from 'sharp';

import { bucket } from '@/lib/gcs';

export const runtime = "nodejs";

const IMAGE_SIZES = {
  small: { width: 480, height: null as number | null, suffix: "_sm" },
  medium: { width: 768, height: null as number | null, suffix: "_md" },
  large: { width: 1024, height: null as number | null, suffix: "_lg" },
  original: {
    width: null as number | null,
    height: null as number | null,
    suffix: "",
  },
} as const;

type ImageSize = keyof typeof IMAGE_SIZES;

interface ImageVariant {
  size: ImageSize;
  url: string;
  width?: number;
  height?: number;
}

interface UploadResult {
  variants: ImageVariant[];
  originalName: string;
}

function tsName(base: string, suffix: string) {
  const nameWithoutExt = base.split(".").slice(0, -1).join(".") || base;
  const timestamp = Date.now();
  return suffix
    ? `${timestamp}-${nameWithoutExt}${suffix}.webp`
    : `${timestamp}-${nameWithoutExt}.webp`;
}

async function processImage(buffer: Buffer, size: ImageSize) {
  const { width, height } = IMAGE_SIZES[size];
  let inst = sharp(buffer);

  if (width || height) {
    inst = inst.resize({
      width: width ?? undefined,
      height: height ?? undefined,
      fit: "inside",
      withoutEnlargement: true,
    });
  }

  const { data, info } = await inst
    .webp({ quality: 85 })
    .toBuffer({ resolveWithObject: true });
  return { buffer: data, metadata: info };
}

function publicGcsUrl(destination: string) {
  return `https://storage.googleapis.com/${process.env.GCP_BUCKET_NAME}/${destination}`;
}

function getSessionId(name: string, size: number) {
  const h = crypto
    .createHash("sha256")
    .update(`${size}:${name}`)
    .digest("hex")
    .slice(0, 40);
  return `${size}-${h}`;
}

async function uploadAndMakeVariantsFromBuffer(
  input: Buffer,
  originalName: string
): Promise<UploadResult> {
  const variants: ImageVariant[] = [];

  for (const [key, cfg] of Object.entries(IMAGE_SIZES)) {
    const size = key as ImageSize;
    try {
      const { buffer, metadata } = await processImage(input, size);
      const fileName = tsName(originalName, cfg.suffix);
      const destination = `uploads/${fileName}`;
      await bucket().file(destination).save(buffer, {
        contentType: "image/webp",
        resumable: false,
      });
      const url = publicGcsUrl(destination);
      variants.push({
        size,
        url,
        width: metadata.width,
        height: metadata.height,
      });
    } catch (e) {
      console.error(`Variant ${size} failed`, e);
    }
  }

  if (variants.length === 0) {
    throw new Error("Failed to process any image variants");
  }

  return { variants, originalName };
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

async function saveChunk(sessionId: string, index: number, chunkBuf: Buffer) {
  const key = `uploads/chunks/${sessionId}/${index}`;
  await bucket()
    .file(key)
    .save(chunkBuf, {
      resumable: false,
      metadata: { contentType: "application/octet-stream" },
    });
  return key;
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

async function cleanupChunks(sessionId: string, total: number) {
  const deletions = Array.from({ length: total }, (_, i) =>
    bucket()
      .file(`uploads/chunks/${sessionId}/${i}`)
      .delete({ ignoreNotFound: true })
  );
  await Promise.allSettled(deletions);
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
          { success: false, error: "No file provided" },
          { status: 400 }
        );
      }
      const result = await uploadAndMakeVariantsFromFile(file);
      return NextResponse.json({ success: true, data: result });
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
        { success: false, error: "Missing chunk upload fields" },
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
        { success: false, error: "Invalid numeric fields" },
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

      return NextResponse.json({ success: true, data: result, composed: true });
    }

    return NextResponse.json({ success: true, received: index });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Upload failed" },
      { status: 500 }
    );
  }
}

