"use client";

import { createAmenity, getAmenities } from "@repo/actions";
import {
  createRoom,
  syncRoomAmenities,
  syncRoomImages,
  updateRoom,
} from "@repo/actions";
import { createImages } from "@repo/actions/images.actions";
import { getVideoUploadUrl } from "@repo/actions/reels.actions";
import { Loader2, Plus, Upload, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { FileUploader, hasValidImages } from "@/components/file-uploader";
import { IconSelectButton, RenderIcon } from "@/components/icon-select";
import PageContainer from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ImagesArraySchema } from "@/lib/image-schema";
import { uploadFilesWithProgress } from "@/lib/upload-files";
import { zodResolver } from "@/lib/zod-resolver";

import type { TRoom } from "@repo/db";

const BED_TYPE_OPTIONS = [
  { label: "Single", value: "single" },
  { label: "Double", value: "double" },
  { label: "Queen", value: "queen" },
  { label: "King", value: "king" },
  { label: "Twin", value: "twin" },
] as const;

import type { FormImage as FileUploaderFormImage } from "@/components/file-uploader";

const ROOM_STATUS_OPTIONS = [
  { label: "Available", value: "available" },
  { label: "Occupied", value: "occupied" },
  { label: "Maintenance", value: "maintenance" },
  { label: "Blocked", value: "blocked" },
] as const;


/** Coerce to a numeric string for DB (e.g. base_price). Returns "0" if invalid. */
function toNumericString(value: null | number | string | undefined, defaultVal: string = "0"): string {
  if (value === undefined || value === null || value === "") return defaultVal;
  const n = Number(String(value).trim());
  return Number.isNaN(n) ? defaultVal : n.toFixed(2);
}

/** Coerce to numeric string or null for optional DB fields (e.g. peak_season_price, rating). */
function toOptionalNumeric(value: null | number | string | undefined): null | string {
  if (value === undefined || value === null || value === "") return null;
  const n = Number(String(value).trim());
  return Number.isNaN(n) ? null : n.toFixed(2);
}

/** For rating (scale 1 decimal). */
function toOptionalRating(value: null | number | string | undefined): null | string {
  if (value === undefined || value === null || value === "") return null;
  const n = Number(String(value).trim());
  return Number.isNaN(n) ? null : n.toFixed(1);
}

const formSchema = z.object({
  description: z.string().optional(),
  slug: z.string().min(1, "Slug is required.").max(255),
  title: z.string().min(1, "Title is required.").max(255),
  // Featured image (like offers)
  image: ImagesArraySchema(0, 1),
  // Gallery images
  images: ImagesArraySchema(0, 20),
  video_url: z.union([z.string().url(), z.literal("")]).optional(),
  // Size & capacity
  bed_type: z.enum(["single", "double", "queen", "king", "twin"]),
  max_occupancy: z.coerce.number().min(1, "Max occupancy must be at least 1"),
  number_of_beds: z.coerce.number().min(0, "Number of beds must be 0 or greater"),
  size_sqft: z.coerce.number().min(0, "Size must be 0 or greater"),
  // Check-in / Check-out
  check_in_time: z.string().max(20).optional(),
  check_out_time: z.string().max(20).optional(),
  // Policies
  children_policy: z.string().optional(),
  extra_beds: z.string().optional(),
  // Pricing
  base_price: z.string().optional(),
  peak_season_price: z.string().optional(),
  weekend_price: z.string().optional(),
  // Reviews
  rating: z.string().optional(),
  review_count: z.coerce.number().min(0).optional(),
  // Display
  is_featured: z.boolean().default(false),
  order: z.coerce.number().int().min(0).default(0),
  status: z.enum(["available", "occupied", "maintenance", "blocked"]),
  // Optional
  floor: z.coerce.number().min(0).optional(),
  notes: z.string().optional(),
  room_number: z.string().max(50).optional(),
  // Amenities (ids)
  amenity_ids: z.array(z.number()).default([]),
});

type TRoomFormProps = {
  initialData: ({ images?: any[] } & TRoom) | null;
  pageTitle: string;
  roomId?: string;
};

export const RoomForm = (props: TRoomFormProps) => {
  const { initialData, pageTitle } = props;
  const router = useRouter();
  const [amenities, setAmenities] = useState<Array<{ icon: string; id: number; label: string }>>([]);
  const [progresses, setProgresses] = useState<Record<string, number>>({});
  const [galleryProgresses, setGalleryProgresses] = useState<Record<string, number>>({});
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [isGalleryUploading, setIsGalleryUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [amenityDialogOpen, setAmenityDialogOpen] = useState(false);
  const [newAmenityLabel, setNewAmenityLabel] = useState("");
  const [newAmenityIcon, setNewAmenityIcon] = useState("");
  const [isCreatingAmenity, setIsCreatingAmenity] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUploadProgress, setVideoUploadProgress] = useState(0);
  const [isVideoUploading, setIsVideoUploading] = useState(false);
  const videoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getAmenities().then((list) => {
      setAmenities(
        (list || []).map((a: { icon: string; id: number; label: string }) => ({ icon: a.icon, id: a.id, label: a.label }))
      );
    });
  }, []);

  const defaultValues = useMemo(() => {
    const room = initialData as { images?: Array<{ image?: { alt_text?: string; id: number; large_url?: string; medium_url?: string; original_url?: string; small_url?: string; }; image_id?: number; order?: number }> } & TRoom;
    return {
      amenity_ids: (room?.amenities ?? []).map((a: { amenity?: { id: number }; amenity_id?: number; }) => a.amenity_id ?? a.amenity?.id ?? 0).filter(Boolean),
      base_price: room?.base_price?.toString() ?? "",
      bed_type: (room?.bed_type as "double" | "king" | "queen" | "single" | "twin") ?? "double",
      check_in_time: room?.check_in_time ?? "14:00",
      check_out_time: room?.check_out_time ?? "11:00",
      children_policy: room?.children_policy ?? "",
      description: room?.description || "",
      extra_beds: room?.extra_beds ?? "",
      floor: room?.floor ?? undefined,
      image: room?.image
        ? [
          {
            _type: "existing" as const,
            alt_text: room.image.alt_text || "",
            image_id: room.image.id,
            large_url: room.image.large_url || "",
            medium_url: room.image.medium_url || "",
            order: 0,
            original_url: room.image.original_url || "",
            small_url: room.image.small_url || "",
          },
        ]
        : [],
      images: (room?.images ?? [])
        .sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0))
        .map((pi: any) => ({
          _type: "existing" as const,
          alt_text: pi.image?.alt_text || "",
          image_id: pi.image_id ?? pi.image?.id,
          large_url: pi.image?.large_url || "",
          medium_url: pi.image?.medium_url || "",
          order: pi.order ?? 0,
          original_url: pi.image?.original_url || "",
          small_url: pi.image?.small_url || "",
        })),
      is_featured: (room?.is_featured ?? 0) === 1,
      max_occupancy: room?.max_occupancy ?? 2,
      notes: room?.notes ?? "",
      number_of_beds: room?.number_of_beds ?? 1,
      order: room?.order ?? 0,
      peak_season_price: room?.peak_season_price?.toString() ?? "",
      rating: room?.rating?.toString() ?? "",
      review_count: room?.review_count ?? 0,
      room_number: room?.room_number ?? "",
      size_sqft: room?.size_sqft ?? 0,
      slug: room?.slug || "",
      status:
        (room?.status as "available" | "blocked" | "maintenance" | "occupied") ?? "available",
      title: room?.title || "",
      video_url: room?.video_url ?? "",
      weekend_price: room?.weekend_price?.toString() ?? "",
    };
  }, [initialData]);

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues,
    resolver: zodResolver(formSchema),
  });

  const featuredImage = form.watch("image");
  const galleryImages = form.watch("images");
  const hasValidFeatured = useMemo(
    () => !featuredImage?.length || hasValidImages(featuredImage as FileUploaderFormImage[]),
    [featuredImage]
  );
  const hasValidGallery = useMemo(
    () => !galleryImages?.length || hasValidImages(galleryImages as FileUploaderFormImage[]),
    [galleryImages]
  );

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setHasAttemptedSubmit(true);
    if (data.image && data.image.length > 0 && !hasValidFeatured) {
      toast.error("Please add alt text to the featured image");
      return;
    }
    if (data.images && data.images.length > 0 && !hasValidGallery) {
      toast.error("Please add alt text to all gallery images");
      return;
    }

    try {
      setIsSubmitting(true);

      // 1) Featured image
      let featuredImageId: null | number = null;
      if (data.image && data.image.length > 0) {
        const img = data.image[0]!;
        if (img._type === "new") {
          setIsImageUploading(true);
          const [result] = await uploadFilesWithProgress(
            [img.file],
            (p) => setProgresses(p),
            "/api/v1/upload-image"
          );
          const created = await createImages([
            {
              alt_text: img.alt_text,
              large_url: result!.image.large_url,
              medium_url: result!.image.medium_url,
              original_url: result!.image.original_url,
              small_url: result!.image.small_url,
            },
          ]);
          if (Array.isArray(created) && created[0]) featuredImageId = created[0].id;
          setIsImageUploading(false);
        } else {
          featuredImageId = img.image_id;
        }
      }

      // 2) Gallery images (upload new, collect all ids + order)
      const galleryPayload: Array<{ image_id: number; order: number }> = [];
      if (data.images && data.images.length > 0) {
        setIsGalleryUploading(true);
        for (let i = 0; i < data.images.length; i++) {
          const img = data.images[i]!;
          if (img._type === "new") {
            const [result] = await uploadFilesWithProgress(
              [img.file],
              (p) => setGalleryProgresses(p),
              "/api/v1/upload-image"
            );
            const created = await createImages([
              {
                alt_text: img.alt_text,
                large_url: result!.image.large_url,
                medium_url: result!.image.medium_url,
                original_url: result!.image.original_url,
                small_url: result!.image.small_url,
              },
            ]);
            if (Array.isArray(created) && created[0])
              galleryPayload.push({ image_id: created[0].id, order: i });
          } else {
            galleryPayload.push({ image_id: img.image_id, order: i });
          }
        }
        setIsGalleryUploading(false);
      }

      const roomPayload = {
        base_price: toNumericString(data.base_price, "0"),
        bed_type: data.bed_type,
        check_in_time: data.check_in_time || null,
        check_out_time: data.check_out_time || null,
        children_policy: data.children_policy || null,
        description: data.description || null,
        extra_beds: data.extra_beds || null,
        floor: data.floor ?? null,
        image: featuredImageId,
        is_featured: (data.is_featured === true) ? 1 : 0,
        max_occupancy: data.max_occupancy,
        notes: data.notes || null,
        number_of_beds: data.number_of_beds,
        order: Math.max(0, Math.floor(Number(data.order) || 0)),
        peak_season_price: toOptionalNumeric(data.peak_season_price),
        rating: toOptionalRating(data.rating),
        review_count: Math.max(0, Math.floor(Number(data.review_count) || 0)),
        room_number: data.room_number || null,
        size_sqft: data.size_sqft,
        slug: data.slug,
        status: data.status,
        title: data.title,
        video_url: data.video_url || null,
        weekend_price: toOptionalNumeric(data.weekend_price),
      };

      let roomId: number;
      if (props.roomId) {
        await updateRoom(parseInt(props.roomId, 10), roomPayload);
        roomId = parseInt(props.roomId, 10);
        await syncRoomImages(roomId, galleryPayload);
        await syncRoomAmenities(
          roomId,
          data.amenity_ids.map((id, order) => ({ amenity_id: id, order }))
        );
        toast.success("Room updated successfully!");
      } else {
        const room = await createRoom(roomPayload);
        if (!room?.id) throw new Error("Failed to create room");
        roomId = room.id;
        await syncRoomImages(roomId, galleryPayload);
        await syncRoomAmenities(
          roomId,
          data.amenity_ids.map((id, order) => ({ amenity_id: id, order }))
        );
        toast.success("Room created successfully!");
      }

      setTimeout(() => {
        router.push("/rooms");
        router.refresh();
      }, 100);
    } catch (err: unknown) {
      console.error("Room save error:", err);
      toast.error(err instanceof Error ? err.message : "Failed to save room");
    } finally {
      setIsSubmitting(false);
      setIsImageUploading(false);
      setIsGalleryUploading(false);
    }
  };

  const busy = isSubmitting || isImageUploading || isGalleryUploading || isVideoUploading;

  return (
    <PageContainer scrollable={true}>
      <div className="w-full">
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">{pageTitle}</h1>
              <div className="flex gap-3">
                <Button
                  disabled={busy}
                  onClick={() => router.back()}
                  type="button"
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button disabled={busy} type="submit">
                  {busy ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isImageUploading || isGalleryUploading
                        ? "Uploading images..."
                        : props.roomId
                          ? "Updating..."
                          : "Creating..."}
                    </>
                  ) : props.roomId ? (
                    "Update Room"
                  ) : (
                    "Create Room"
                  )}
                </Button>
              </div>
            </div>

            <Tabs className="w-full" onValueChange={setActiveTab} value={activeTab}>
              <TabsList className="sticky top-0 z-10 flex w-full overflow-x-auto">
                <TabsTrigger className="flex-1 min-w-0" value="basic">Basic</TabsTrigger>
                <TabsTrigger className="flex-1 min-w-0" value="media">Media</TabsTrigger>
                <TabsTrigger className="flex-1 min-w-0" value="capacity">Capacity</TabsTrigger>
                <TabsTrigger className="flex-1 min-w-0" value="pricing">Pricing</TabsTrigger>
                <TabsTrigger className="flex-1 min-w-0" value="reviews">Status</TabsTrigger>
                <TabsTrigger className="flex-1 min-w-0" value="amenities">Amenities</TabsTrigger>
              </TabsList>

              {/* Tab: Basic Info */}
              <TabsContent className="space-y-6" value="basic">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>
                      Title, slug, and description for the room
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Ocean View Suite" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="slug"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Slug</FormLabel>
                            <FormControl>
                              <Input placeholder="ocean-view-suite" {...field} />
                            </FormControl>
                            <FormDescription className="text-xs">
                              URL-friendly identifier
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              className="min-h-[100px]"
                              placeholder="Describe the room..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tab: Media */}
              <TabsContent className="space-y-6" value="media">
                <Card>
                  <CardHeader>
                    <CardTitle>Media</CardTitle>
                    <CardDescription>
                      Featured image, gallery, and video URL
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="image"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Featured image</FormLabel>
                          <FormControl>
                            <FileUploader
                              disabled={busy}
                              id="room-featured-image"
                              maxFiles={1}
                              onValueChange={field.onChange}
                              progresses={progresses}
                              showValidation={hasAttemptedSubmit}
                              value={field.value || []}
                            />
                          </FormControl>
                          <FormDescription className="text-xs">
                            Main image for listings
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="images"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gallery images</FormLabel>
                          <FormControl>
                            <FileUploader
                              disabled={busy}
                              id="room-gallery-images"
                              maxFiles={20}
                              onValueChange={field.onChange}
                              progresses={galleryProgresses}
                              showValidation={hasAttemptedSubmit}
                              value={field.value || []}
                            />
                          </FormControl>
                          <FormDescription className="text-xs">
                            Additional room images. Drag to reorder.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="video_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Video</FormLabel>
                          <FormControl>
                            <div className="space-y-3">
                              {/* Current video preview */}
                              {field.value && !videoFile && (
                                <div className="relative rounded-lg border overflow-hidden">
                                  <video
                                    className="w-full max-h-48 object-contain bg-black"
                                    controls
                                    preload="metadata"
                                    src={`${field.value}#t=0.5`}
                                  />
                                  <Button
                                    className="absolute top-2 right-2 h-7 w-7 p-0"
                                    onClick={() => {
                                      field.onChange("");
                                    }}
                                    size="sm"
                                    type="button"
                                    variant="destructive"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              )}

                              {/* Upload area */}
                              {!field.value && !videoFile && (
                                <div
                                  className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed p-6 text-center transition-colors hover:border-primary"
                                  onClick={() => videoInputRef.current?.click()}
                                >
                                  <Upload className="h-8 w-8 text-muted-foreground" />
                                  <p className="text-sm text-muted-foreground">
                                    Click to select a video file
                                  </p>
                                </div>
                              )}

                              {/* Selected file pending upload */}
                              {videoFile && (
                                <div className="space-y-2 rounded-lg border p-4">
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <p className="text-sm font-medium">{videoFile.name}</p>
                                      <p className="text-xs text-muted-foreground">
                                        {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                                      </p>
                                    </div>
                                    <div className="flex gap-2">
                                      <Button
                                        disabled={isVideoUploading}
                                        onClick={async () => {
                                          try {
                                            setIsVideoUploading(true);
                                            setVideoUploadProgress(0);
                                            const { publicUrl, signedUrl } = await getVideoUploadUrl(
                                              videoFile.name,
                                              videoFile.type
                                            );
                                            await new Promise<void>((resolve, reject) => {
                                              const xhr = new XMLHttpRequest();
                                              xhr.open("PUT", signedUrl);
                                              xhr.setRequestHeader("Content-Type", videoFile.type);
                                              xhr.upload.onprogress = (event) => {
                                                if (event.lengthComputable) {
                                                  setVideoUploadProgress(
                                                    Math.round((event.loaded / event.total) * 100)
                                                  );
                                                }
                                              };
                                              xhr.onload = () =>
                                                xhr.status >= 200 && xhr.status < 300
                                                  ? resolve()
                                                  : reject(new Error(`Upload failed: ${xhr.status}`));
                                              xhr.onerror = () => reject(new Error("Upload failed"));
                                              xhr.send(videoFile);
                                            });
                                            field.onChange(publicUrl);
                                            setVideoFile(null);
                                            setVideoUploadProgress(0);
                                            toast.success("Video uploaded!");
                                          } catch (err: unknown) {
                                            toast.error(
                                              err instanceof Error ? err.message : "Video upload failed"
                                            );
                                          } finally {
                                            setIsVideoUploading(false);
                                          }
                                        }}
                                        size="sm"
                                        type="button"
                                      >
                                        {isVideoUploading ? (
                                          <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                                        ) : (
                                          <Upload className="mr-1 h-4 w-4" />
                                        )}
                                        Upload
                                      </Button>
                                      <Button
                                        disabled={isVideoUploading}
                                        onClick={() => {
                                          setVideoFile(null);
                                          setVideoUploadProgress(0);
                                          if (videoInputRef.current) videoInputRef.current.value = "";
                                        }}
                                        size="sm"
                                        type="button"
                                        variant="outline"
                                      >
                                        Remove
                                      </Button>
                                    </div>
                                  </div>
                                  {isVideoUploading && videoUploadProgress > 0 && (
                                    <div className="space-y-1">
                                      <Progress value={videoUploadProgress} />
                                      <p className="text-center text-xs text-muted-foreground">
                                        Uploading... {videoUploadProgress}%
                                      </p>
                                    </div>
                                  )}
                                </div>
                              )}

                              <input
                                accept="video/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    setVideoFile(file);
                                    setVideoUploadProgress(0);
                                  }
                                }}
                                ref={videoInputRef}
                                type="file"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tab: Capacity & Policies */}
              <TabsContent className="space-y-6" value="capacity">
                <Card>
                  <CardHeader>
                    <CardTitle>Capacity & Policies</CardTitle>
                    <CardDescription>
                      Size, beds, check-in/out, and policy details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Size & capacity</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <FormField
                          control={form.control}
                          name="size_sqft"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Size (sq ft)</FormLabel>
                              <FormControl>
                                <Input min={0} type="number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="max_occupancy"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Max occupancy</FormLabel>
                              <FormControl>
                                <Input min={1} type="number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="number_of_beds"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Number of beds</FormLabel>
                              <FormControl>
                                <Input min={0} type="number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="bed_type"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Bed type</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {BED_TYPE_OPTIONS.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value}>
                                      {opt.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Check-in & check-out</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="check_in_time"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Check-in time</FormLabel>
                              <FormControl>
                                <Input placeholder="14:00" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="check_out_time"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Check-out time</FormLabel>
                              <FormControl>
                                <Input placeholder="11:00" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Policies</h3>
                      <FormField
                        control={form.control}
                        name="children_policy"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Children policy</FormLabel>
                            <FormControl>
                              <Textarea
                                className="min-h-[80px]"
                                placeholder="e.g. Children welcome. Extra bed available."
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="extra_beds"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Extra beds</FormLabel>
                            <FormControl>
                              <Textarea
                                className="min-h-[60px]"
                                placeholder="e.g. Extra bed on request. Charge may apply."
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tab: Pricing */}
              <TabsContent className="space-y-6" value="pricing">
                <Card>
                  <CardHeader>
                    <CardTitle>Pricing</CardTitle>
                    <CardDescription>
                      Base, peak season, and weekend rates
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="base_price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Base price</FormLabel>
                            <FormControl>
                              <Input
                                inputMode="decimal"
                                min={0}
                                placeholder="0.00"
                                step="0.01"
                                type="number"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription className="text-xs">
                              Numbers only (e.g. 10000)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="peak_season_price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Peak season price</FormLabel>
                            <FormControl>
                              <Input placeholder="Optional" step="0.01" type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="weekend_price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Weekend price</FormLabel>
                            <FormControl>
                              <Input placeholder="Optional" step="0.01" type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tab: Reviews & Status */}
              <TabsContent className="space-y-6" value="reviews">
                <Card>
                  <CardHeader>
                    <CardTitle>Reviews & Status</CardTitle>
                    <CardDescription>
                      Rating, review count, featured, and availability
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Reviews</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="rating"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Rating (e.g. 4.5)</FormLabel>
                              <FormControl>
                                <Input max={5} min={0} placeholder="Optional" step="0.1" type="number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="review_count"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Review count</FormLabel>
                              <FormControl>
                                <Input min={0} type="number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Display & status</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="is_featured"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">Featured room</FormLabel>
                                <FormDescription className="text-xs">
                                  Show in featured sections
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="order"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Display order</FormLabel>
                              <FormControl>
                                <Input min={0} type="number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="status"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Status</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {ROOM_STATUS_OPTIONS.map((s) => (
                                    <SelectItem key={s.value} value={s.value}>
                                      {s.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tab: Amenities & Optional */}
              <TabsContent className="space-y-6" value="amenities">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>
                          Amenities
                          {form.watch("amenity_ids")?.length > 0 && (
                            <span className="ml-2 text-sm font-normal text-muted-foreground">
                              ({form.watch("amenity_ids").length} selected)
                            </span>
                          )}
                        </CardTitle>
                        <CardDescription>
                          Select the amenities available in this room
                        </CardDescription>
                      </div>
                      <Dialog onOpenChange={(open) => {
                        setAmenityDialogOpen(open);
                        if (!open) {
                          setNewAmenityLabel("");
                          setNewAmenityIcon("");
                        }
                      }} open={amenityDialogOpen}>
                        <DialogTrigger asChild>
                          <Button size="sm" type="button" variant="outline">
                            <Plus className="mr-1 h-4 w-4" />
                            New Amenity
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Create Amenity</DialogTitle>
                            <DialogDescription>
                              Add a new amenity. It will be auto-selected for this room.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-2">
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Icon</label>
                              <IconSelectButton
                                onIconSelect={setNewAmenityIcon}
                                selectedIcon={newAmenityIcon || undefined}
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium" htmlFor="new-amenity-label">
                                Label
                              </label>
                              <Input
                                id="new-amenity-label"
                                onChange={(e) => setNewAmenityLabel(e.target.value)}
                                placeholder="e.g. Bathtub"
                                value={newAmenityLabel}
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button
                              disabled={isCreatingAmenity}
                              onClick={() => setAmenityDialogOpen(false)}
                              type="button"
                              variant="outline"
                            >
                              Cancel
                            </Button>
                            <Button
                              disabled={isCreatingAmenity || !newAmenityLabel.trim() || !newAmenityIcon.trim()}
                              onClick={async () => {
                                try {
                                  setIsCreatingAmenity(true);
                                  const created = await createAmenity({
                                    icon: newAmenityIcon.trim(),
                                    label: newAmenityLabel.trim(),
                                  });
                                  if (created?.id) {
                                    setAmenities((prev) => [
                                      ...prev,
                                      { icon: created.icon, id: created.id, label: created.label },
                                    ]);
                                    const currentIds = form.getValues("amenity_ids") || [];
                                    form.setValue("amenity_ids", [...currentIds, created.id]);
                                    toast.success("Amenity created and selected!");
                                  }
                                  setAmenityDialogOpen(false);
                                  setNewAmenityLabel("");
                                  setNewAmenityIcon("");
                                } catch (err: unknown) {
                                  toast.error(err instanceof Error ? err.message : "Failed to create amenity");
                                } finally {
                                  setIsCreatingAmenity(false);
                                }
                              }}
                              type="button"
                            >
                              {isCreatingAmenity && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                              Create
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="amenity_ids"
                      render={({ field }) => (
                        <FormItem>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                            {amenities.map((a) => {
                              const isSelected = field.value?.includes(a.id);
                              return (
                                <label
                                  className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 cursor-pointer transition-all hover:bg-accent/50 ${isSelected
                                      ? "border-primary bg-primary/5"
                                      : "border-muted"
                                    }`}
                                  htmlFor={`amenity-${a.id}`}
                                  key={a.id}
                                >
                                  <Checkbox
                                    checked={isSelected}
                                    className="sr-only"
                                    id={`amenity-${a.id}`}
                                    onCheckedChange={(checked) => {
                                      const next = checked
                                        ? [...(field.value || []), a.id]
                                        : (field.value || []).filter((id) => id !== a.id);
                                      field.onChange(next);
                                    }}
                                  />
                                  <RenderIcon className="text-foreground" name={a.icon} size={24} />
                                  <span className="text-xs font-medium text-center leading-tight">
                                    {a.label}
                                  </span>
                                </label>
                              );
                            })}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Optional Details</CardTitle>
                    <CardDescription>
                      Floor, room number, and internal notes
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="floor"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Floor</FormLabel>
                            <FormControl>
                              <Input
                                min={0}
                                onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                                type="number"
                                value={field.value ?? ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="room_number"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Room number</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. 101" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Internal notes</FormLabel>
                          <FormControl>
                            <Textarea className="min-h-[60px]" placeholder="Not visible to guests" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </form>
        </Form>
      </div>
    </PageContainer>
  );
};