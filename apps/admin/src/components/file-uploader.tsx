"use client";
import React, { useCallback, useMemo } from "react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

import type { DragEndEvent } from "@dnd-kit/core";

export const ExistingImageSchema = z.object({
  _type: z.literal("existing"),
  image_id: z.number(),
  order: z.number().int().nonnegative(),
  small_url: z.string().url(),
  medium_url: z.string().url(),
  large_url: z.string().url(),
  original_url: z.string().url(),
  alt_text: z.string().min(1, "Alt text is required"),
});

export const NewImageSchema = z.object({
  _type: z.literal("new"),
  _tmpId: z.string(),
  previewUrl: z.string(),
  file: z.any(),
  mime_type: z.string(),
  size: z.number(),
  alt_text: z.string().min(1, "Alt text is required"),
});

export type ExistingFormImage = {
  _type: "existing";
  image_id: number;
  order: number;
  small_url: string;
  medium_url: string;
  large_url: string;
  original_url: string;
  alt_text: string;
};

export type NewFormImage = {
  _type: "new";
  _tmpId: string;
  file: File;
  previewUrl: string;
  size: number;
  mime_type: string;
  alt_text: string;
};

export type FormImage = ExistingFormImage | NewFormImage;

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
    isValid: errors.length === 0,
    errors,
  };
};

export const hasValidImages = (images: FormImage[]) => {
  return (
    images.length > 0 && images.every((img) => img.alt_text?.trim().length > 0)
  );
};

type Props = {
  value: FormImage[];
  onValueChange: (next: FormImage[]) => void;
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number;
  progresses?: Record<string, number>;
  disabled?: boolean;
  showValidation?: boolean;
  id?: string;
};

export const FileUploader: React.FC<Props> = ({
  value,
  onValueChange,
  multiple = true,
  maxFiles = 8,
  maxSize = MAX_FILE_SIZE,
  progresses = {},
  disabled,
  showValidation = false,
  id = "file-input-hidden",
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const onFiles = useCallback(
    (files: FileList | File[]) => {
      const incoming = Array.from(files);
      const accept = new Set(ACCEPTED_IMAGE_TYPES);
      const filtered = incoming.filter(
        (f) => f.size <= maxSize && accept.has(f.type)
      );
      if (filtered.length === 0) return;

      const remainingSlots = Math.max(0, maxFiles - value.length);
      const take = filtered.slice(0, remainingSlots);

      const mapped: NewFormImage[] = take.map((file) => ({
        _type: "new",
        _tmpId: crypto.randomUUID(),
        file,
        previewUrl: URL.createObjectURL(file),
        size: file.size,
        mime_type: file.type,
        alt_text: "",
      }));

      onValueChange([...value, ...mapped]);
    },
    [value, onValueChange, maxFiles, maxSize]
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
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (disabled) return;
          const files = e.dataTransfer.files;
          if (files && files.length > 0) onFiles(files);
        }}
        onClick={() => {
          if (disabled) return;
          document.getElementById(id)?.click();
        }}
      >
        <p className="text-sm">Click or drag images here</p>
        <input
          id={id}
          type="file"
          accept={ACCEPTED_IMAGE_TYPES.join(",")}
          multiple={multiple}
          className="hidden"
          onChange={onInputChange}
          disabled={disabled}
        />
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map((i) => i.id)}
          strategy={rectSortingStrategy}
        >
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map(({ id, img }, idx) => (
              <SortableItem
                key={id}
                id={id}
                img={img}
                progress={progresses[id] ?? 0}
                onRemove={() => removeAt(idx)}
                onAltTextChange={(altText) => updateAltText(idx, altText)}
                disabled={disabled}
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
  id,
  img,
  progress,
  onRemove,
  onAltTextChange,
  disabled,
}: {
  id: string;
  img: FormImage;
  progress: number;
  onRemove: () => void;
  onAltTextChange: (altText: string) => void;
  disabled?: boolean;
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
      ref={setNodeRef}
      style={style}
      className="relative rounded-md border bg-card overflow-hidden"
    >
      <div
        className="absolute top-2 left-2 z-10 cursor-grab active:cursor-grabbing bg-black/50 rounded p-1"
        {...attributes}
        {...listeners}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          className="text-white"
          fill="currentColor"
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
          variant="destructive"
          size="sm"
          type="button"
          onClick={onRemove}
          disabled={disabled}
        >
          ×
        </Button>
      </div>

      <div className="aspect-video relative">
        <img
          src={src}
          alt={img.alt_text || ""}
          className="h-full w-full object-cover"
        />
        {progress > 0 && progress < 100 ? (
          <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1">
            Uploading… {Math.round(progress)}%
          </div>
        ) : null}
      </div>

      <div className="p-3 space-y-2">
        <Label htmlFor={`alt-text-${id}`} className="text-sm font-medium">
          Alt Text *
        </Label>
        <Input
          id={`alt-text-${id}`}
          type="text"
          value={img.alt_text}
          onChange={(e) => onAltTextChange(e.target.value)}
          placeholder="Describe this image..."
          disabled={disabled}
          className={`text-sm ${!img.alt_text?.trim() ? "border-red-300 focus:border-red-500" : ""}`}
        />
        {!img.alt_text?.trim() && (
          <p className="text-xs text-red-500">Alt text is required</p>
        )}
      </div>
    </div>
  );
}
