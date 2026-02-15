"use client";
import {
  closestCenter,
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from "@repo/db/utils/file-utils";
import React, { useCallback, useMemo } from "react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { DragEndEvent } from "@dnd-kit/core";

export const ExistingImageSchema = z.object({
  _type: z.literal("existing"),
  alt_text: z.string().min(1, "Alt text is required"),
  image_id: z.number(),
  large_url: z.string().url(),
  medium_url: z.string().url(),
  order: z.number().int().nonnegative(),
  original_url: z.string().url(),
  small_url: z.string().url(),
});

export const NewImageSchema = z.object({
  _tmpId: z.string(),
  _type: z.literal("new"),
  alt_text: z.string().min(1, "Alt text is required"),
  file: z.any(),
  mime_type: z.string(),
  previewUrl: z.string(),
  size: z.number(),
});

export type ExistingFormImage = {
  _type: "existing";
  alt_text: string;
  image_id: number;
  large_url: string;
  medium_url: string;
  order: number;
  original_url: string;
  small_url: string;
};

export type FormImage = ExistingFormImage | NewFormImage;

export type NewFormImage = {
  _tmpId: string;
  _type: "new";
  alt_text: string;
  file: File;
  mime_type: string;
  previewUrl: string;
  size: number;
};

export const isExisting = (i: FormImage): i is ExistingFormImage =>
  i._type === "existing";
export const isNew = (i: FormImage): i is NewFormImage => i._type === "new";
export const keyOf = (img: FormImage) =>
  img._type === "existing" ? `ex-${img.image_id}` : `new-${img._tmpId}`;

export const validateImages = (images: FormImage[]) => {
  const errors: string[] = [];

  images.forEach((img, index) => {
    if (!img.alt_text?.trim()) {
      errors.push(`Image ${index + 1}: Alt text is required`);
    }
  });

  return {
    errors,
    isValid: errors.length === 0,
  };
};

export const hasValidImages = (images: FormImage[]) => {
  return (
    images.length > 0 && images.every((img) => img.alt_text?.trim().length > 0)
  );
};

type Props = {
  disabled?: boolean;
  id?: string;
  maxFiles?: number;
  maxSize?: number;
  minDimensions?: { width: number; height: number };
  multiple?: boolean;
  onValueChange: (next: FormImage[]) => void;
  progresses?: Record<string, number>;
  showValidation?: boolean;
  value: FormImage[];
};

export const FileUploader: React.FC<Props> = ({
  disabled,
  id = "file-input-hidden",
  maxFiles = 8,
  maxSize = MAX_FILE_SIZE,
  minDimensions,
  multiple = true,
  onValueChange,
  progresses = {},
  showValidation = false,
  value,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const [rejectedFiles, setRejectedFiles] = React.useState<
    { name: string; reason: string }[]
  >([]);

  const onFiles = useCallback(
    async (files: File[] | FileList) => {
      const incoming = Array.from(files);
      const accept = new Set(ACCEPTED_IMAGE_TYPES);
      const rejected: { name: string; reason: string }[] = [];

      // First pass: validate type and size
      const typeAndSizeValid = incoming.filter((f) => {
        if (!accept.has(f.type)) {
          rejected.push({
            name: f.name,
            reason: "Unsupported format. Use JPG, PNG, WebP, or AVIF.",
          });
          return false;
        }
        if (f.size > maxSize) {
          rejected.push({
            name: f.name,
            reason: `File is ${(f.size / (1024 * 1024)).toFixed(1)}MB. Max size is ${Math.round(maxSize / (1024 * 1024))}MB.`,
          });
          return false;
        }
        return true;
      });

      // Second pass: validate landscape orientation and dimensions
      const filtered: File[] = [];
      for (const f of typeAndSizeValid) {
        try {
          const bitmap = await createImageBitmap(f);
          const { width, height } = bitmap;
          bitmap.close();
          if (height > width) {
            rejected.push({
              name: f.name,
              reason: `Image is portrait (${width}x${height}). Only landscape images are allowed.`,
            });
          } else if (
            minDimensions &&
            (width < minDimensions.width || height < minDimensions.height)
          ) {
            rejected.push({
              name: f.name,
              reason: `Image is ${width}x${height}px. Minimum required is ${minDimensions.width}x${minDimensions.height}px.`,
            });
          } else {
            filtered.push(f);
          }
        } catch {
          filtered.push(f);
        }
      }

      setRejectedFiles(rejected);

      if (filtered.length === 0) return;

      const remainingSlots = Math.max(0, maxFiles - value.length);
      const take = filtered.slice(0, remainingSlots);

      const mapped: NewFormImage[] = take.map((file) => ({
        _tmpId: crypto.randomUUID(),
        _type: "new",
        alt_text: "",
        file,
        mime_type: file.type,
        previewUrl: URL.createObjectURL(file),
        size: file.size,
      }));

      onValueChange([...value, ...mapped]);
    },
    [value, onValueChange, maxFiles, maxSize, minDimensions]
  );

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files) return;
      onFiles(e.target.files);
      e.target.value = "";
    },
    [onFiles]
  );

  const removeAt = useCallback(
    (idx: number) => {
      const target = value[idx]!;
      if (isNew(target)) URL.revokeObjectURL(target.previewUrl);
      const next = [...value.slice(0, idx), ...value.slice(idx + 1)];
      onValueChange(next);
    },
    [value, onValueChange]
  );

  const updateAltText = useCallback(
    (idx: number, altText: string) => {
      const next = [...value];
      next[idx] = { ...next[idx]!, alt_text: altText };
      onValueChange(next);
    },
    [value, onValueChange]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const oldIndex = value.findIndex((i) => keyOf(i) === active.id);
      const newIndex = value.findIndex((i) => keyOf(i) === over.id);
      if (oldIndex === -1 || newIndex === -1) return;

      const next = arrayMove(value, oldIndex, newIndex);
      onValueChange(next);
    },
    [value, onValueChange]
  );

  const items = useMemo(
    () => value.map((i) => ({ id: keyOf(i), img: i })),
    [value]
  );

  const validation = useMemo(() => validateImages(value), [value]);

  return (
    <div className="w-full">
      <div
        className={`border-2 border-dashed rounded-md p-4 text-center ${disabled ? "opacity-50" : "cursor-pointer"}`}
        onClick={() => {
          if (disabled) return;
          document.getElementById(id)?.click();
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (disabled) return;
          const files = e.dataTransfer.files;
          if (files && files.length > 0) onFiles(files);
        }}
      >
        <p className="text-sm">Click or drag images here</p>
        <p className="text-xs text-muted-foreground mt-1">
          JPG, PNG, WebP, AVIF — Max {Math.round(maxSize / (1024 * 1024))}MB per
          file — Landscape only
          {minDimensions && ` — Min ${minDimensions.width}x${minDimensions.height}px`}
        </p>
        <input
          accept={ACCEPTED_IMAGE_TYPES.join(",")}
          className="hidden"
          disabled={disabled}
          id={id}
          multiple={multiple}
          onChange={onInputChange}
          type="file"
        />
      </div>

      {rejectedFiles.length > 0 && (
        <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-md">
          <p className="text-sm font-medium text-amber-800">
            Some files were not added:
          </p>
          <ul className="mt-1 text-xs text-amber-700 list-disc list-inside">
            {rejectedFiles.map((f, idx) => (
              <li key={idx}>
                <span className="font-medium">{f.name}</span> — {f.reason}
              </li>
            ))}
          </ul>
        </div>
      )}

      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        sensors={sensors}
      >
        <SortableContext
          items={items.map((i) => i.id)}
          strategy={rectSortingStrategy}
        >
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map(({ id, img }, idx) => (
              <SortableItem
                disabled={disabled}
                id={id}
                img={img}
                key={id}
                onAltTextChange={(altText) => updateAltText(idx, altText)}
                onRemove={() => removeAt(idx)}
                progress={progresses[id] ?? 0}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {showValidation && !validation.isValid && value.length > 0 && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm font-medium text-red-800">
            Please complete the following:
          </p>
          <ul className="mt-1 text-sm text-red-700 list-disc list-inside">
            {validation.errors.map((error, idx) => (
              <li key={idx}>{error}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

function SortableItem({
  disabled,
  id,
  img,
  onAltTextChange,
  onRemove,
  progress,
}: {
  disabled?: boolean;
  id: string;
  img: FormImage;
  onAltTextChange: (altText: string) => void;
  onRemove: () => void;
  progress: number;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const src =
    img._type === "existing"
      ? (img.small_url ?? img.original_url)
      : img.previewUrl;

  return (
    <div
      className="relative rounded-md border bg-card overflow-hidden"
      ref={setNodeRef}
      style={style}
    >
      <div
        className="absolute top-2 left-2 z-10 cursor-grab active:cursor-grabbing bg-black/50 rounded p-1"
        {...attributes}
        {...listeners}
      >
        <svg
          className="text-white"
          fill="currentColor"
          height="12"
          viewBox="0 0 12 12"
          width="12"
        >
          <circle cx="2" cy="2" r="1" />
          <circle cx="2" cy="6" r="1" />
          <circle cx="2" cy="10" r="1" />
          <circle cx="6" cy="2" r="1" />
          <circle cx="6" cy="6" r="1" />
          <circle cx="6" cy="10" r="1" />
          <circle cx="10" cy="2" r="1" />
          <circle cx="10" cy="6" r="1" />
          <circle cx="10" cy="10" r="1" />
        </svg>
      </div>

      <div className="absolute top-2 right-2 z-10">
        <Button
          disabled={disabled}
          onClick={onRemove}
          size="sm"
          type="button"
          variant="destructive"
        >
          ×
        </Button>
      </div>

      <div className="aspect-video relative">
        <img
          alt={img.alt_text || ""}
          className="h-full w-full object-cover"
          src={src}
        />
        {progress > 0 && progress < 100 ? (
          <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1">
            Uploading… {Math.round(progress)}%
          </div>
        ) : null}
      </div>

      <div className="p-3 space-y-2">
        <Label className="text-sm font-medium" htmlFor={`alt-text-${id}`}>
          Alt Text *
        </Label>
        <Input
          className={`text-sm ${!img.alt_text?.trim() ? "border-red-300 focus:border-red-500" : ""}`}
          disabled={disabled}
          id={`alt-text-${id}`}
          onChange={(e) => onAltTextChange(e.target.value)}
          placeholder="Describe this image..."
          type="text"
          value={img.alt_text}
        />
        {!img.alt_text?.trim() && (
          <p className="text-xs text-red-500">Alt text is required</p>
        )}
      </div>
    </div>
  );
}
