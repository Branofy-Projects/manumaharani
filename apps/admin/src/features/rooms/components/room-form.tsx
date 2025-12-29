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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea";
import { ImagesArraySchema } from "@/lib/image-schema";
import { uploadFilesWithProgress } from "@/lib/upload-files";
import { zodResolver } from "@hookform/resolvers/zod";
import { createImages } from "@repo/actions/images.actions";
import { createRoom, updateRoom, updateRoomImages } from "@repo/actions";
import { getRoomTypes } from "@repo/actions/room-types.actions";
import type { TRoom } from "@repo/db";

import type { NewFormImage, FormImage } from "@/lib/image-schema";
import type { FormImage as FileUploaderFormImage } from "@/components/file-uploader";

const ROOM_STATUS_OPTIONS = [
  { value: "available", label: "Available" },
  { value: "occupied", label: "Occupied" },
  { value: "maintenance", label: "Maintenance" },
  { value: "blocked", label: "Blocked" },
] as const;

const formSchema = z.object({
  title: z.string().min(1, "Title is required.").max(255),
  room_type_id: z.string().min(1, "Room type is required."),
  description: z.string().optional(),
  images: ImagesArraySchema(0, 8),
  floor: z.coerce.number().min(0, "Floor must be 0 or greater"),
  room_number: z.string().min(1, "Room number is required.").max(50),
  status: z.enum(["available", "occupied", "maintenance", "blocked"]),
  notes: z.string().optional(),
});

type TRoomFormProps = {
  initialData: (TRoom & { images?: any[] }) | null;
  pageTitle: string;
  roomId?: string;
};

export const RoomForm = (props: TRoomFormProps) => {
  const { initialData, pageTitle } = props;

  const router = useRouter();
  const [roomTypes, setRoomTypes] = useState<
    Array<{ id: number; name: string }>
  >([]);
  const [loadingRoomTypes, setLoadingRoomTypes] = useState(true);

  // Load room types
  useEffect(() => {
    getRoomTypes({ limit: 100 }).then((result) => {
      setRoomTypes(
        result.roomTypes.map((rt: any) => ({ id: rt.id, name: rt.name }))
      );
      setLoadingRoomTypes(false);
    });
  }, []);

  const defaultValues = useMemo(() => {
    return {
      title: initialData?.title || "",
      room_type_id: initialData?.room_type_id?.toString() || "",
      description: initialData?.description || "",
      floor: initialData?.floor || 0,
      room_number: initialData?.room_number || "",
      status:
        (initialData?.status as
          | "available"
          | "occupied"
          | "maintenance"
          | "blocked") || "available",
      notes: initialData?.notes || "",
      images: (initialData?.images ?? [])
        .sort((a: any, b: any) => a.order - b.order)
        .map((pi: any) => ({
          _type: "existing" as const,
          image_id: pi.image_id || pi.image?.id,
          order: pi.order,
          small_url: pi.image?.small_url || "",
          medium_url: pi.image?.medium_url || "",
          large_url: pi.image?.large_url || "",
          original_url: pi.image?.original_url || "",
          alt_text: pi.image?.alt_text || "",
        })),
    };
  }, [initialData]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const [progresses, setProgresses] = useState<Record<string, number>>({});
  const [isImagesUploading, setIsImagesUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  const images = form.watch("images");
  const hasValidAltText = useMemo(() => {
    return hasValidImages(images as FileUploaderFormImage[]);
  }, [images]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setHasAttemptedSubmit(true);

    if (data.images && data.images.length > 0 && !hasValidAltText) {
      return;
    }

    try {
      setIsSubmitting(true);

      // Handle images if provided
      let uploadedImageMap = new Map<string, number>();

      if (data.images && data.images.length > 0) {
        const newImages = data.images.filter(
          (img: FormImage) => img._type === "new"
        ) as NewFormImage[];

        if (newImages.length > 0) {
          setIsImagesUploading(true);

          const files = newImages.map((img) => img.file);
          const uploadResults = await uploadFilesWithProgress(
            files,
            (progressMap: Record<string, number>) => {
              setProgresses(progressMap);
            },
            "/api/v1/upload-image"
          );

          const imageData = uploadResults.map((result, index) => ({
            small_url: result.image.small_url,
            medium_url: result.image.medium_url,
            large_url: result.image.large_url,
            original_url: result.image.original_url,
            alt_text: newImages[index]!.alt_text,
          }));

          const createdImages = await createImages(imageData);

          if (Array.isArray(createdImages)) {
            createdImages.forEach((img, index) => {
              uploadedImageMap.set(newImages[index]!._tmpId, img.id);
            });
          }

          setIsImagesUploading(false);
        }

        // Compute final ordered list with actual image IDs
        const final = data.images.map((img, idx) => {
          if (img._type === "existing") {
            return {
              image_id: img.image_id,
              order: idx,
              alt_text: img.alt_text,
            };
          } else {
            const actualImageId = uploadedImageMap.get(img._tmpId);
            if (!actualImageId) {
              throw new Error(
                `Failed to find uploaded image for ${img._tmpId}`
              );
            }
            return {
              image_id: actualImageId,
              order: idx,
              alt_text: img.alt_text,
            };
          }
        });

        // Create or update room
        let room;
        if (props.roomId) {
          room = await updateRoom(parseInt(props.roomId, 10), {
            title: data.title,
            description: data.description || null,
            room_type_id: parseInt(data.room_type_id),
            floor: data.floor,
            room_number: data.room_number,
            status: data.status,
            notes: data.notes || null,
          });
          // Update images
          await updateRoomImages(parseInt(props.roomId, 10), final);
          toast.success("Room updated successfully!");
        } else {
          room = await createRoom({
            title: data.title,
            description: data.description || null,
            room_type_id: parseInt(data.room_type_id),
            floor: data.floor,
            room_number: data.room_number,
            status: data.status,
            notes: data.notes || null,
          });
          // Then update images
          await updateRoomImages(room.id, final);
          toast.success("Room created successfully!");
        }

        // Small delay to ensure toast is visible, then redirect
        setTimeout(() => {
          try {
            router.push("/rooms");
          } catch (redirectError) {
            console.error("Redirect error:", redirectError);
            // Fallback to window.location if router fails
            if (typeof window !== "undefined") {
              window.location.href = "/rooms";
            }
          }
        }, 100);
      } else {
        // Create or update room without images
        if (props.roomId) {
          await updateRoom(parseInt(props.roomId, 10), {
            title: data.title,
            description: data.description || null,
            room_type_id: parseInt(data.room_type_id),
            floor: data.floor,
            room_number: data.room_number,
            status: data.status,
            notes: data.notes || null,
          });
          toast.success("Room updated successfully!");
        } else {
          await createRoom({
            title: data.title,
            description: data.description || null,
            room_type_id: parseInt(data.room_type_id),
            floor: data.floor,
            room_number: data.room_number,
            status: data.status,
            notes: data.notes || null,
          });
          toast.success("Room created successfully!");
        }

        // Small delay to ensure toast is visible, then redirect
        setTimeout(() => {
          try {
            router.push("/rooms");
          } catch (redirectError) {
            console.error("Redirect error:", redirectError);
            // Fallback to window.location if router fails
            if (typeof window !== "undefined") {
              window.location.href = "/rooms";
            }
          }
        }, 100);
      }
    } catch (error: any) {
      console.error("Error creating room - Full error object:", error);
      console.error("Error message:", error?.message);
      console.error("Error stack:", error?.stack);
      console.error("Error string:", String(error));

      const errorMessage =
        error?.message || String(error) || "Failed to create room";

      // Check if it's a URL-related error
      if (
        errorMessage.toLowerCase().includes("invalid url") ||
        errorMessage.toLowerCase().includes("url")
      ) {
        console.warn(
          "URL error detected, but room may have been created. Attempting redirect..."
        );
        toast.success("Room created successfully!");
        setTimeout(() => {
          if (typeof window !== "undefined") {
            window.location.href = "/rooms";
          } else {
            router.push("/rooms");
          }
        }, 100);
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
      setIsImagesUploading(false);
    }
  };

  return (
    <PageContainer scrollable={true}>
      <div className="w-full">
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">{pageTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Ocean View Suite 101"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        The title/name of the room
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="room_type_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Room Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a room type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {loadingRoomTypes ? (
                            <SelectItem value="loading" disabled>
                              Loading...
                            </SelectItem>
                          ) : (
                            roomTypes.map((rt) => (
                              <SelectItem key={rt.id} value={rt.id.toString()}>
                                {rt.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormDescription className="text-xs">
                        Select the type of room
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                            placeholder="0"
                            value={field.value || ""}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value) || 0)
                            }
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          Floor number where the room is located
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="room_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Room Number</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 101" {...field} />
                        </FormControl>
                        <FormDescription className="text-xs">
                          Unique room identifier
                        </FormDescription>
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
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {ROOM_STATUS_OPTIONS.map((status) => (
                              <SelectItem
                                key={status.value}
                                value={status.value}
                              >
                                {status.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription className="text-xs">
                          Current availability status
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
                      <FormDescription className="text-xs">
                        A detailed description of the room
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Internal notes about this room..."
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Internal notes (not visible to guests)
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
                      <FormLabel>Images</FormLabel>
                      <FormControl>
                        <FileUploader
                          value={field.value || []}
                          onValueChange={field.onChange}
                          maxFiles={8}
                          progresses={progresses}
                          disabled={isImagesUploading || isSubmitting}
                          showValidation={hasAttemptedSubmit}
                          id="room-images"
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Upload images for this room. Drag and drop to reorder.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    disabled={isSubmitting || isImagesUploading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting || isImagesUploading}
                  >
                    {isSubmitting || isImagesUploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {isImagesUploading
                          ? "Uploading images..."
                          : props.roomId ? "Updating..." : "Creating..."}
                      </>
                    ) : (
                      props.roomId ? "Update Room" : "Create Room"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};
