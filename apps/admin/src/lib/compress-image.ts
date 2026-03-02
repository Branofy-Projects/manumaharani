const MAX_DIMENSION = 4096;
const QUALITY = 0.92;

/**
 * Converts and compresses an image file to WebP using Canvas API.
 * - Always outputs WebP format (web standard)
 * - 92% quality (visually lossless)
 * - Caps dimensions at 4096px (preserves aspect ratio)
 */
export async function compressImage(file: File): Promise<File> {
  // Skip non-raster formats
  if (!file.type.startsWith("image/")) return file;

  const bitmap = await createImageBitmap(file);
  const { width, height } = bitmap;

  // Calculate scaled dimensions
  let targetWidth = width;
  let targetHeight = height;
  if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
    const scale = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height);
    targetWidth = Math.round(width * scale);
    targetHeight = Math.round(height * scale);
  }

  const canvas = new OffscreenCanvas(targetWidth, targetHeight);
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;

  ctx.drawImage(bitmap, 0, 0, targetWidth, targetHeight);
  bitmap.close();

  const blob = await canvas.convertToBlob({
    type: "image/webp",
    quality: QUALITY,
  });

  return new File([blob], file.name.replace(/\.[^.]+$/, ".webp"), {
    type: "image/webp",
    lastModified: Date.now(),
  });
}
