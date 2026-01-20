"use client";
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

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
import { createImages } from '@repo/actions/images.actions';
import { createGallery, updateGallery } from '@repo/actions';
import type { TGallery } from "@repo/db";

import type { FormImage as FileUploaderFormImage } from "@/components/file-uploader";

const GALLERY_CATEGORIES = [
  { value: "rooms", label: "Rooms" },
  { value: "dining", label: "Dining" },
  { value: "spa", label: "Spa" },
  { value: "activities", label: "Activities" },
  { value: "facilities", label: "Facilities" },
  { value: "events", label: "Events" },
  { value: "surroundings", label: "Surroundings" },
  { value: "general", label: "General" },
] as const;

const GALLERY_TYPES = [
  { value: "image", label: "Image" },
  { value: "video", label: "Video" },
] as const;

const formSchema = z.object({
  title: z.string().min(1, "Title is required.").max(255),
  description: z.string().optional(),
  image: ImagesArraySchema(1, 1),
  type: z.enum(["image", "video"]),
  category: z.enum(["rooms", "dining", "spa", "activities", "facilities", "events", "surroundings", "general"]),
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
  initialData: (TGallery & { image?: any }) | null;
  pageTitle: string;
  galleryId?: string;
};

const GalleryForm = (props: TGalleryFormProps) => {
  const { initialData, pageTitle } = props;

  const router = useRouter();

  const defaultValues = useMemo(() => {
    return {
      title: initialData?.title || "",
      description: initialData?.description || "",
      type: (initialData?.type as "image" | "video") || "image",
      category: (initialData?.category as typeof GALLERY_CATEGORIES[number]["value"]) || "general",
      video_url: initialData?.video_url || "",
      image: initialData?.image
        ? [
            {
              _type: "existing" as const,
              image_id: initialData.image.id,
              order: 0,
              small_url: initialData.image.small_url || "",
              medium_url: initialData.image.medium_url || "",
              large_url: initialData.image.large_url || "",
              original_url: initialData.image.original_url || "",
              alt_text: initialData.image.alt_text || "",
            },
          ]
        : [],
    };
  }, [initialData]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
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
      let imageId: number | null = null;

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
          small_url: uploadResult[0]!.image.small_url,
          medium_url: uploadResult[0]!.image.medium_url,
          large_url: uploadResult[0]!.image.large_url,
          original_url: uploadResult[0]!.image.original_url,
          alt_text: imageData.alt_text,
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
          title: data.title,
          description: data.description || null,
          image_id: imageId,
          type: data.type,
          category: data.category,
          video_url: data.type === "video" ? data.video_url || null : null,
        });
        toast.success("Gallery item updated successfully!");
      } else {
        await createGallery({
          title: data.title,
          description: data.description || null,
          image_id: imageId,
          type: data.type,
          category: data.category,
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                        placeholder="Describe the gallery item..."
                        className="min-h-[80px]"
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
                          type="url"
                          placeholder="https://example.com/video.mp4" 
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
                        value={field.value || []}
                        onValueChange={field.onChange}
                        maxFiles={1}
                        progresses={progresses}
                        disabled={isImageUploading || isSubmitting}
                        showValidation={hasAttemptedSubmit}
                        id="gallery-image"
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
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isSubmitting || isImageUploading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || isImageUploading}
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

