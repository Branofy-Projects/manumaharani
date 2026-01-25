"use client";
import { createEvent, updateEvent } from "@repo/actions";
import { createImages } from "@repo/actions/images.actions";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import type { FormImage as FileUploaderFormImage } from "@/components/file-uploader";

import { FileUploader, hasValidImages } from "@/components/file-uploader";
import PageContainer from "@/components/layout/page-container";
import { RichTextEditor } from "@/components/rich-text-editor";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { ImagesArraySchema } from "@/lib/image-schema";
import { uploadFilesWithProgress } from "@/lib/upload-files";
import { cn } from "@/lib/utils";
import { zodResolver } from "@/lib/zod-resolver";

import type { TEvent } from "@repo/db/schema/types.schema";

const formSchema = z.object({
  date: z.object({
    from: z.date(),
    to: z.date().optional(),
  }, { message: "Event date is required" }),
  description: z.string().min(1, "Description is required."),
  endTime: z.string().min(1, "End time is required."),
  excerpt: z.string().min(1, "Excerpt is required.").max(500),
  image: ImagesArraySchema(0, 1),
  location: z.string().min(1, "Location is required."),
  name: z.string().min(1, "Name is required.").max(255),
  startTime: z.string().min(1, "Start time is required."),
});

type TEventFormProps = {
  eventId?: string;
  initialData: ({ image?: any } & TEvent) | null;
  pageTitle: string;
};

const EventForm = (props: TEventFormProps) => {
  const { initialData, pageTitle } = props;

  const router = useRouter();

  const defaultValues = useMemo(() => {
    return {
      date: initialData?.startDate
        ? {
          from: new Date(initialData.startDate),
          to: initialData.endDate ? new Date(initialData.endDate) : undefined,
        }
        : undefined,
      description: initialData?.description || "",
      endTime: initialData?.endTime || "16:00",
      excerpt: initialData?.excerpt || "",
      image: initialData?.image
        ? [
          {
            _type: "existing" as const,
            alt_text: initialData.image.alt_text || "",
            image_id: initialData.image.id,
            large_url: initialData.image.large_url || "",
            medium_url: initialData.image.medium_url || "",
            order: 0,
            original_url: initialData.image.original_url || "",
            small_url: initialData.image.small_url || "",
          },
        ]
        : [],
      location: initialData?.location || "",
      name: initialData?.name || "",
      startTime: initialData?.startTime || "08:00",
    };
  }, [initialData]);

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues,
    resolver: zodResolver(formSchema),
  });

  const [progresses, setProgresses] = useState<Record<string, number>>({});
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  const image = form.watch("image");
  const hasValidImage = useMemo(() => {
    return hasValidImages(image as FileUploaderFormImage[]);
  }, [image]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setHasAttemptedSubmit(true);

    // Validate image if provided
    if (data.image && data.image.length > 0 && !hasValidImage) {
      toast.error("Please add alt text to the image");
      return;
    }

    try {
      setIsSubmitting(true);

      // Handle image upload
      let imageId: null | number = null;

      if (data.image && data.image.length > 0) {
        const imageFile = data.image[0];

        if (imageFile._type === "new") {
          setIsImageUploading(true);

          const uploadResult = await uploadFilesWithProgress(
            [imageFile.file],
            (progressMap: Record<string, number>) => {
              setProgresses(progressMap);
            },
            "/api/v1/upload-image"
          );

          const imageData = [
            {
              alt_text: imageFile.alt_text,
              large_url: uploadResult[0]!.image.large_url,
              medium_url: uploadResult[0]!.image.medium_url,
              original_url: uploadResult[0]!.image.original_url,
              small_url: uploadResult[0]!.image.small_url,
            },
          ];

          const createdImages = await createImages(imageData);

          if (Array.isArray(createdImages) && createdImages.length > 0) {
            imageId = createdImages[0]!.id;
          }

          setIsImageUploading(false);
        } else {
          imageId = imageFile.image_id;
        }
      }

      if (imageId === null) {
        toast.error("An image is required for events");
        setIsSubmitting(false);
        return;
      }

      // Create or update event
      if (props.eventId) {
        // Update existing event
        await updateEvent(props.eventId, {
          description: data.description,
          endDate: data.date.to ? data.date.to.toISOString() : undefined,
          endTime: data.endTime,
          excerpt: data.excerpt,
          image: imageId,
          location: data.location,
          name: data.name,
          startDate: data.date.from.toISOString(),
          startTime: data.startTime,
        });
        toast.success("Event updated successfully!");
      } else {
        // Create new event
        await createEvent({
          description: data.description,
          endDate: data.date.to ? data.date.to.toISOString() : undefined,
          endTime: data.endTime,
          excerpt: data.excerpt,
          image: imageId,
          location: data.location,
          name: data.name,
          startDate: data.date.from.toISOString(),
          startTime: data.startTime,
        });
        toast.success("Event created successfully!");
      }

      // Small delay to ensure toast is visible, then redirect
      setTimeout(() => {
        router.push("/events");
      }, 100);
    } catch (error: any) {
      console.error("Error creating event:", error);
      toast.error(error?.message || "Failed to create event");
    } finally {
      setIsSubmitting(false);
      setIsImageUploading(false);
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
                className="space-y-6"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter event name..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="endTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter event location..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date of event</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              className={cn(
                                "w-[240px] pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                              variant={"outline"}
                            >
                              {field.value?.from ? (
                                field.value.to ? (
                                  <>
                                    {format(field.value.from, "LLL dd, y")} -{" "}
                                    {format(field.value.to, "LLL dd, y")}
                                  </>
                                ) : (
                                  format(field.value.from, "LLL dd, y")
                                )
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent align="start" className="w-auto p-0">
                          <Calendar
                            defaultMonth={field.value?.from}
                            disabled={(date) =>
                              date < new Date("1900-01-01")
                            }
                            initialFocus
                            mode="range"
                            numberOfMonths={2}
                            onSelect={field.onChange}
                            selected={field.value}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="excerpt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Excerpt</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter a brief excerpt for your event..."
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        A short summary of your event (max 500 characters)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image</FormLabel>
                      <FormControl>
                        <FileUploader
                          disabled={isImageUploading || isSubmitting}
                          id="event-image"
                          maxFiles={1}
                          onValueChange={field.onChange}
                          progresses={progresses}
                          showValidation={hasAttemptedSubmit}
                          value={field.value || []}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Upload an image for your event (single image)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <RichTextEditor
                          onChange={field.onChange}
                          value={field.value}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Write your event description using the rich text editor
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-3 pt-2">
                  <Button
                    disabled={isSubmitting || isImageUploading}
                    onClick={() => router.back()}
                    type="button"
                    variant="outline"
                  >
                    Cancel
                  </Button>
                  <Button
                    disabled={isSubmitting || isImageUploading}
                    type="submit"
                  >
                    {isSubmitting || isImageUploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {isImageUploading
                          ? "Uploading image..."
                          : props.eventId
                            ? "Updating..."
                            : "Creating..."}
                      </>
                    ) : props.eventId ? (
                      "Update Event"
                    ) : (
                      "Create Event"
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

export default EventForm;
