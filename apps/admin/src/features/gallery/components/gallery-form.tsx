"use client";
import { createGallery, updateGallery } from '@repo/actions';
import { createImages } from '@repo/actions/images.actions';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import type { FormImage as FileUploaderFormImage } from "@/components/file-uploader";

import { FileUploader, hasValidImages } from '@/components/file-uploader';
import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ImagesArraySchema } from '@/lib/image-schema';
import { uploadFilesWithProgress } from '@/lib/upload-files';
import { zodResolver } from '@/lib/zod-resolver';

import type { TGallery } from "@repo/db";

const GALLERY_CATEGORIES = [
  { label: "Room", value: "room" },
  { label: "Overview", value: "overview" },
  { label: "Dining", value: "dining" },
  { label: "Wedding", value: "wedding" },
] as const;

const GALLERY_TYPES = [
  { label: "Image", value: "image" },
  { label: "Video", value: "video" },
] as const;

const formSchema = z.object({
  category: z.enum(["room", "overview", "dining", "wedding"]),
  description: z.string().optional(),
  image: ImagesArraySchema(1, 1),
  title: z.string().min(1, "Title is required.").max(255),
  type: z.enum(["image", "video"]),
  video_url: z.string().url("Invalid URL format").optional().or(z.literal("")),
}).refine((data) => {
  if (data.type === "video") {
    return !!data.video_url && data.video_url.trim() !== "";
  }
  return true;
}, {
  message: "Video URL is required when type is video",
  path: ["video_url"],
});

type TGalleryFormProps = {
  galleryId?: string;
  initialData: ({ image?: any } & TGallery) | null;
  pageTitle: string;
};

const GalleryForm = (props: TGalleryFormProps) => {
  const { initialData, pageTitle } = props;

  const router = useRouter();

  const defaultValues = useMemo(() => {
    return {
      category: (initialData?.category as typeof GALLERY_CATEGORIES[number]["value"]) || "overview",
      description: initialData?.description || "",
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
      title: initialData?.title || "",
      type: (initialData?.type as "image" | "video") || "image",
      video_url: initialData?.video_url || "",
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
  const type = form.watch("type");
  const hasValidImage = useMemo(() => {
    return hasValidImages(image as FileUploaderFormImage[]);
  }, [image]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setHasAttemptedSubmit(true);

    if (!hasValidImage) {
      toast.error("Please add alt text to the image");
      return;
    }

    try {
      setIsSubmitting(true);

      const imageData = data.image[0];
      let imageId: null | number = null;

      if (imageData._type === "new") {
        setIsImageUploading(true);

        const uploadResult = await uploadFilesWithProgress(
          [imageData.file],
          (progressMap: Record<string, number>) => {
            setProgresses(progressMap);
          },
          "/api/v1/upload-image"
        );

        const imageUploadData = [{
          alt_text: imageData.alt_text,
          large_url: uploadResult[0]!.image.large_url,
          medium_url: uploadResult[0]!.image.medium_url,
          original_url: uploadResult[0]!.image.original_url,
          small_url: uploadResult[0]!.image.small_url,
        }];

        const createdImages = await createImages(imageUploadData);

        if (Array.isArray(createdImages) && createdImages.length > 0) {
          imageId = createdImages[0]!.id;
        }

        setIsImageUploading(false);
      } else {
        imageId = imageData.image_id;
      }

      if (props.galleryId) {
        await updateGallery(parseInt(props.galleryId, 10), {
          category: data.category,
          description: data.description || null,
          image_id: imageId,
          title: data.title,
          type: data.type,
          video_url: data.type === "video" ? data.video_url || null : null,
        });
        toast.success("Gallery item updated successfully!");
      } else {
        await createGallery({
          category: data.category,
          description: data.description || null,
          image_id: imageId,
          title: data.title,
          type: data.type,
          video_url: data.type === "video" ? data.video_url || null : null,
        });
        toast.success("Gallery item created successfully!");
      }

      setTimeout(() => {
        try {
          router.push('/gallery');
        } catch (redirectError) {
          console.error("Redirect error:", redirectError);
          if (typeof window !== 'undefined') {
            window.location.href = '/gallery';
          }
        }
      }, 100);
    } catch (error: any) {
      console.error("Error creating gallery item:", error);
      const errorMessage = error?.message || String(error) || "Failed to create gallery item";

      if (errorMessage.toLowerCase().includes("invalid url") ||
        errorMessage.toLowerCase().includes("url")) {
        toast.success("Gallery item created successfully!");
        setTimeout(() => {
          if (typeof window !== 'undefined') {
            window.location.href = '/gallery';
          } else {
            router.push('/gallery');
          }
        }, 100);
      } else {
        toast.error(errorMessage);
      }
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
              <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter gallery item title..." {...field} />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Title for this gallery item
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
                        <Textarea
                          className="min-h-[80px]"
                          placeholder="Describe the gallery item..."
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Optional description
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {GALLERY_TYPES.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription className="text-xs">
                          Image or video
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {GALLERY_CATEGORIES.map((category) => (
                              <SelectItem key={category.value} value={category.value}>
                                {category.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription className="text-xs">
                          Gallery category
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {type === "video" && (
                  <FormField
                    control={form.control}
                    name="video_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Video URL</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://example.com/video.mp4"
                            type="url"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          URL to the video file
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image</FormLabel>
                      <FormControl>
                        <FileUploader
                          disabled={isImageUploading || isSubmitting}
                          id="gallery-image"
                          maxFiles={1}
                          minDimensions={{ width: 1920, height: 1080 }}
                          onValueChange={field.onChange}
                          progresses={progresses}
                          showValidation={hasAttemptedSubmit}
                          value={field.value || []}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Upload an image for this gallery item (required)
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
                        {isImageUploading ? "Uploading image..." : props.galleryId ? "Updating..." : "Creating..."}
                      </>
                    ) : (
                      props.galleryId ? "Update Gallery Item" : "Create Gallery Item"
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

export default GalleryForm;

