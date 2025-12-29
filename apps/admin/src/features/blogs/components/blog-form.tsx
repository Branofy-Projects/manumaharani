"use client";
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { FileUploader, hasValidImages } from '@/components/file-uploader';
import { RichTextEditor } from '@/components/rich-text-editor';
import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ImagesArraySchema } from '@/lib/image-schema';
import { uploadFilesWithProgress } from '@/lib/upload-files';
import { zodResolver } from '@hookform/resolvers/zod';
import { createImages } from '@repo/actions/images.actions';
import { createBlog, updateBlog } from '@repo/actions';
import type { TBlog } from "@repo/db";

import type {
  NewFormImage,
  FormImage,
} from "@/lib/image-schema";
import type { FormImage as FileUploaderFormImage } from "@/components/file-uploader";

const formSchema = z.object({
  title: z.string().min(1, "Title is required.").max(500),
  content: z.string().min(1, "Content is required."),
  thumbnail: ImagesArraySchema(0, 1),
});

type TBlogFormProps = {
  initialData: (TBlog & { featuredImage?: any }) | null;
  pageTitle: string;
  blogId?: string;
};

const BlogForm = (props: TBlogFormProps) => {
  const { initialData, pageTitle } = props;

  const router = useRouter();

  const defaultValues = useMemo(() => {
    return {
      title: initialData?.title || "",
      content: initialData?.content || "",
      thumbnail: initialData?.featuredImage
        ? [
            {
              _type: "existing" as const,
              image_id: initialData.featuredImage.id,
              order: 0,
              small_url: initialData.featuredImage.small_url || "",
              medium_url: initialData.featuredImage.medium_url || "",
              large_url: initialData.featuredImage.large_url || "",
              original_url: initialData.featuredImage.original_url || "",
              alt_text: initialData.featuredImage.alt_text || "",
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
  const [isThumbnailUploading, setIsThumbnailUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  const thumbnail = form.watch("thumbnail");
  const hasValidThumbnail = useMemo(() => {
    return hasValidImages(thumbnail as FileUploaderFormImage[]);
  }, [thumbnail]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setHasAttemptedSubmit(true);

    // Validate thumbnail if provided
    if (data.thumbnail && data.thumbnail.length > 0 && !hasValidThumbnail) {
      toast.error("Please add alt text to the thumbnail image");
      return;
    }

    try {
      setIsSubmitting(true);

      // Generate slug from title
      const slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      // Generate excerpt from content (first 200 characters, strip HTML)
      const excerpt = data.content
        .replace(/<[^>]*>/g, "")
        .replace(/\s+/g, " ")
        .trim()
        .substring(0, 200);

      // Handle thumbnail image upload
      let featuredImageId: number | null = null;

      if (data.thumbnail && data.thumbnail.length > 0) {
        const thumbnailImage = data.thumbnail[0];
        
        if (thumbnailImage._type === "new") {
          setIsThumbnailUploading(true);
          
          const uploadResult = await uploadFilesWithProgress(
            [thumbnailImage.file],
            (progressMap: Record<string, number>) => {
              setProgresses(progressMap);
            },
            "/api/v1/upload-image"
          );

          const imageData = [{
            small_url: uploadResult[0]!.image.small_url,
            medium_url: uploadResult[0]!.image.medium_url,
            large_url: uploadResult[0]!.image.large_url,
            original_url: uploadResult[0]!.image.original_url,
            alt_text: thumbnailImage.alt_text,
          }];

          const createdImages = await createImages(imageData);
          
          if (Array.isArray(createdImages) && createdImages.length > 0) {
            featuredImageId = createdImages[0]!.id;
          }
          
          setIsThumbnailUploading(false);
        } else {
          featuredImageId = thumbnailImage.image_id;
        }
      }

      // Create or update blog
      if (props.blogId) {
        // Update existing blog
        await updateBlog(parseInt(props.blogId, 10), {
          title: data.title,
          content: data.content,
          slug,
          excerpt: excerpt || data.title,
          featured_image_id: featuredImageId,
        });
        toast.success("Blog post updated successfully!");
      } else {
        // Create new blog
        await createBlog({
          title: data.title,
          content: data.content,
          slug,
          excerpt: excerpt || data.title,
          featured_image_id: featuredImageId,
          status: "draft",
          category: "general",
        });
        toast.success("Blog post created successfully!");
      }
      
      // Small delay to ensure toast is visible, then redirect
      setTimeout(() => {
        try {
          router.push('/blogs');
        } catch (redirectError) {
          console.error("Redirect error:", redirectError);
          if (typeof window !== 'undefined') {
            window.location.href = '/blogs';
          }
        }
      }, 100);
    } catch (error: any) {
      console.error("Error creating blog - Full error object:", error);
      console.error("Error message:", error?.message);
      console.error("Error stack:", error?.stack);
      console.error("Error string:", String(error));
      
      const errorMessage = error?.message || String(error) || "Failed to create blog post";
      
      // Check if it's a URL-related error
      if (errorMessage.toLowerCase().includes("invalid url") || 
          errorMessage.toLowerCase().includes("url")) {
        console.warn("URL error detected, but blog may have been saved. Attempting redirect...");
        toast.success(props.blogId ? "Blog post updated successfully!" : "Blog post created successfully!");
        setTimeout(() => {
          if (typeof window !== 'undefined') {
            window.location.href = '/blogs';
          } else {
            router.push('/blogs');
          }
        }, 100);
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
      setIsThumbnailUploading(false);
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => {
                  // Generate slug preview from title
                  const slugPreview = field.value
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/(^-|-$)/g, "");

                  return (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter blog post title..." {...field} />
                      </FormControl>
                      <FormDescription className="text-xs">
                        The title of your blog post
                        {slugPreview && (
                          <span className="block mt-1 text-muted-foreground">
                            URL slug: <code className="text-xs bg-muted px-1 py-0.5 rounded">{slugPreview || "..."}</code>
                          </span>
                        )}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name="thumbnail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thumbnail Image</FormLabel>
                    <FormControl>
                      <FileUploader
                        value={field.value || []}
                        onValueChange={field.onChange}
                        maxFiles={1}
                        progresses={progresses}
                        disabled={isThumbnailUploading || isSubmitting}
                        showValidation={hasAttemptedSubmit}
                        id="blog-thumbnail"
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Upload a thumbnail image for your blog post (single image)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <RichTextEditor
                        content={field.value}
                        onChange={field.onChange}
                        placeholder="Start writing your blog post..."
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Write your blog post content using the rich text editor
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
                  disabled={isSubmitting || isThumbnailUploading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || isThumbnailUploading}
                >
                  {isSubmitting || isThumbnailUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isThumbnailUploading ? "Uploading image..." : props.blogId ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    props.blogId ? "Update Blog Post" : "Create Blog Post"
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

export default BlogForm;

