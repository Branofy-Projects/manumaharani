"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { FileUploader, hasValidImages } from "@/components/file-uploader";
import PageContainer from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import { createImages } from "@repo/actions/images.actions";
import { getAmenities } from "@repo/actions";
import {
  createRoom,
  updateRoom,
  syncRoomImages,
  syncRoomAmenities,
} from "@repo/actions";
import type { TRoom } from "@repo/db";

const BED_TYPE_OPTIONS = [
  { value: "single", label: "Single" },
  { value: "double", label: "Double" },
  { value: "queen", label: "Queen" },
  { value: "king", label: "King" },
  { value: "twin", label: "Twin" },
] as const;

import type { NewFormImage, FormImage } from "@/lib/image-schema";
import type { FormImage as FileUploaderFormImage } from "@/components/file-uploader";

const ROOM_STATUS_OPTIONS = [
  { value: "available", label: "Available" },
  { value: "occupied", label: "Occupied" },
  { value: "maintenance", label: "Maintenance" },
  { value: "blocked", label: "Blocked" },
] as const;

/** Coerce to a numeric string for DB (e.g. base_price). Returns "0" if invalid. */
function toNumericString(value: string | number | undefined | null, defaultVal: string = "0"): string {
  if (value === undefined || value === null || value === "") return defaultVal;
  const n = Number(String(value).trim());
  return Number.isNaN(n) ? defaultVal : n.toFixed(2);
}

/** Coerce to numeric string or null for optional DB fields (e.g. peak_season_price, rating). */
function toOptionalNumeric(value: string | number | undefined | null): string | null {
  if (value === undefined || value === null || value === "") return null;
  const n = Number(String(value).trim());
  return Number.isNaN(n) ? null : n.toFixed(2);
}

/** For rating (scale 1 decimal). */
function toOptionalRating(value: string | number | undefined | null): string | null {
  if (value === undefined || value === null || value === "") return null;
  const n = Number(String(value).trim());
  return Number.isNaN(n) ? null : n.toFixed(1);
}

const formSchema = z.object({
  title: z.string().min(1, "Title is required.").max(255),
  slug: z.string().min(1, "Slug is required.").max(255),
  description: z.string().optional(),
  // Featured image (like offers)
  image: ImagesArraySchema(0, 1),
  // Gallery images
  images: ImagesArraySchema(0, 20),
  video_url: z.union([z.string().url(), z.literal("")]).optional(),
  // Size & capacity
  size_sqft: z.coerce.number().min(0, "Size must be 0 or greater"),
  max_occupancy: z.coerce.number().min(1, "Max occupancy must be at least 1"),
  number_of_beds: z.coerce.number().min(0, "Number of beds must be 0 or greater"),
  bed_type: z.enum(["single", "double", "queen", "king", "twin"]),
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
  room_number: z.string().max(50).optional(),
  notes: z.string().optional(),
  // Amenities (ids)
  amenity_ids: z.array(z.number()).default([]),
});

type TRoomFormProps = {
  initialData: (TRoom & { images?: any[] }) | null;
  pageTitle: string;
  roomId?: string;
};

export const RoomForm = (props: TRoomFormProps) => {
  const { initialData, pageTitle } = props;
  const router = useRouter();
  const [amenities, setAmenities] = useState<Array<{ id: number; label: string }>>([]);
  const [progresses, setProgresses] = useState<Record<string, number>>({});
  const [galleryProgresses, setGalleryProgresses] = useState<Record<string, number>>({});
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [isGalleryUploading, setIsGalleryUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");

  useEffect(() => {
    getAmenities().then((list) => {
      setAmenities(
        (list || []).map((a: { id: number; label: string }) => ({ id: a.id, label: a.label }))
      );
    });
  }, []);

  const defaultValues = useMemo(() => {
    const room = initialData as TRoom & { images?: Array<{ image_id?: number; image?: { id: number; small_url?: string; medium_url?: string; large_url?: string; original_url?: string; alt_text?: string }; order?: number }> };
    return {
      title: room?.title || "",
      slug: room?.slug || "",
      description: room?.description || "",
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
          image_id: pi.image_id ?? pi.image?.id,
          order: pi.order ?? 0,
          small_url: pi.image?.small_url || "",
          medium_url: pi.image?.medium_url || "",
          large_url: pi.image?.large_url || "",
          original_url: pi.image?.original_url || "",
          alt_text: pi.image?.alt_text || "",
        })),
      video_url: room?.video_url ?? "",
      size_sqft: room?.size_sqft ?? 0,
      max_occupancy: room?.max_occupancy ?? 2,
      number_of_beds: room?.number_of_beds ?? 1,
      bed_type: (room?.bed_type as "single" | "double" | "queen" | "king" | "twin") ?? "double",
      check_in_time: room?.check_in_time ?? "14:00",
      check_out_time: room?.check_out_time ?? "11:00",
      children_policy: room?.children_policy ?? "",
      extra_beds: room?.extra_beds ?? "",
      base_price: room?.base_price?.toString() ?? "",
      peak_season_price: room?.peak_season_price?.toString() ?? "",
      weekend_price: room?.weekend_price?.toString() ?? "",
      rating: room?.rating?.toString() ?? "",
      review_count: room?.review_count ?? 0,
      is_featured: (room?.is_featured ?? 0) === 1,
      order: room?.order ?? 0,
      status:
        (room?.status as "available" | "occupied" | "maintenance" | "blocked") ?? "available",
      floor: room?.floor ?? undefined,
      room_number: room?.room_number ?? "",
      notes: room?.notes ?? "",
      amenity_ids: (room?.amenities ?? []).map((a: { amenity_id?: number; amenity?: { id: number } }) => a.amenity_id ?? a.amenity?.id ?? 0).filter(Boolean),
    };
  }, [initialData]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
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
      let featuredImageId: number | null = null;
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
        title: data.title,
        slug: data.slug,
        description: data.description || null,
        image: featuredImageId,
        video_url: data.video_url || null,
        size_sqft: data.size_sqft,
        max_occupancy: data.max_occupancy,
        number_of_beds: data.number_of_beds,
        bed_type: data.bed_type,
        check_in_time: data.check_in_time || null,
        check_out_time: data.check_out_time || null,
        children_policy: data.children_policy || null,
        extra_beds: data.extra_beds || null,
        base_price: toNumericString(data.base_price, "0"),
        peak_season_price: toOptionalNumeric(data.peak_season_price),
        weekend_price: toOptionalNumeric(data.weekend_price),
        rating: toOptionalRating(data.rating),
        review_count: Math.max(0, Math.floor(Number(data.review_count) || 0)),
        is_featured: (data.is_featured === true || data.is_featured === 1) ? 1 : 0,
        order: Math.max(0, Math.floor(Number(data.order) || 0)),
        status: data.status,
        floor: data.floor ?? null,
        room_number: data.room_number || null,
        notes: data.notes || null,
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

  const busy = isSubmitting || isImageUploading || isGalleryUploading;

  return (
    <PageContainer scrollable={true}>
      <div className="w-full">
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">{pageTitle}</h1>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={busy}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={busy}>
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
              <TabsList className="grid sticky top-0 z-10 w-full grid-cols-6">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="media">Media</TabsTrigger>
                <TabsTrigger value="capacity">Capacity & Policies</TabsTrigger>
                <TabsTrigger value="pricing">Pricing</TabsTrigger>
                <TabsTrigger value="reviews">Reviews & Status</TabsTrigger>
                <TabsTrigger value="amenities">Amenities & Optional</TabsTrigger>
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
                            placeholder="Describe the room..."
                            className="min-h-[100px]"
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
                            value={field.value || []}
                            onValueChange={field.onChange}
                            maxFiles={1}
                            progresses={progresses}
                            disabled={busy}
                            showValidation={hasAttemptedSubmit}
                            id="room-featured-image"
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
                            value={field.value || []}
                            onValueChange={field.onChange}
                            maxFiles={20}
                            progresses={galleryProgresses}
                            disabled={busy}
                            showValidation={hasAttemptedSubmit}
                            id="room-gallery-images"
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
                        <FormLabel>Video URL</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://..."
                            type="url"
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
                            <Input type="number" min={0} {...field} />
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
                            <Input type="number" min={1} {...field} />
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
                            <Input type="number" min={0} {...field} />
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
                            placeholder="e.g. Children welcome. Extra bed available."
                            className="min-h-[80px]"
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
                            placeholder="e.g. Extra bed on request. Charge may apply."
                            className="min-h-[60px]"
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
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Pricing</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="base_price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Base price</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              min={0}
                              placeholder="0.00"
                              inputMode="decimal"
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
                            <Input type="number" step="0.01" placeholder="Optional" {...field} />
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
                            <Input type="number" step="0.01" placeholder="Optional" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
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
                            <Input type="number" step="0.1" min={0} max={5} placeholder="Optional" {...field} />
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
                            <Input type="number" min={0} {...field} />
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
                          <FormLabel className="text-base">Featured room</FormLabel>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <FormDescription className="text-xs">
                            Show in featured sections
                          </FormDescription>
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
                            <Input type="number" min={0} {...field} />
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
                    <CardTitle>Amenities & Optional</CardTitle>
                    <CardDescription>
                      Room amenities and optional floor, number, notes
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Amenities</h3>
                  <FormField
                    control={form.control}
                    name="amenity_ids"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex flex-wrap gap-4 rounded-md border p-4">
                          {amenities.map((a) => (
                            <div
                              key={a.id}
                              className="flex flex-row items-center space-x-2"
                            >
                              <Checkbox
                                id={`amenity-${a.id}`}
                                checked={field.value?.includes(a.id)}
                                onCheckedChange={(checked) => {
                                  const next = checked
                                    ? [...(field.value || []), a.id]
                                    : (field.value || []).filter((id) => id !== a.id);
                                  field.onChange(next);
                                }}
                              />
                              <label
                                htmlFor={`amenity-${a.id}`}
                                className="text-sm font-normal cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {a.label}
                              </label>
                            </div>
                          ))}
                        </div>
                        <FormDescription className="text-xs">
                          Select amenities for this room
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4 pt-4">
                  <h3 className="text-sm font-medium">Optional</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="floor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Floor</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={0}
                              value={field.value ?? ""}
                              onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
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
                          <Textarea placeholder="Not visible to guests" className="min-h-[60px]" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
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
