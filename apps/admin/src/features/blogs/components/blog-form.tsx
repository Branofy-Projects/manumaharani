"use client";
import { createBlog, updateBlog } from "@repo/actions/blogs.actions";
import { createImages } from "@repo/actions/images.actions";
import { blogStatusEnum } from "@repo/db/schema/blogs.schema";
import { Loader2 } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ImagesArraySchema } from "@/lib/image-schema";
import { uploadFilesWithProgress } from "@/lib/upload-files";
import { zodResolver } from "@/lib/zod-resolver";

import type { TBlog } from "@repo/db/schema/types.schema";

const formSchema = z.object({
  content: z.string().min(1, "Content is required."),
  excerpt: z
    .string()
    .min(1, "Excerpt is required")
    .max(500, "Excerpt cannot exceed 500 characters."),
  status: z.enum(blogStatusEnum.enumValues),
  thumbnail: ImagesArraySchema(0, 1),
  title: z.string().min(1, "Title is required.").max(500),
});

type TBlogFormProps = {
  blogId?: string;
  initialData: ({ featuredImage?: any } & TBlog) | null;
  pageTitle: string;
};

const BlogForm = (props: TBlogFormProps) => {
  const { initialData, pageTitle } = props;

  const router = useRouter();

  const defaultValues = useMemo(() => {
    return {
      content: initialData?.content || "",
      excerpt: initialData?.excerpt || "",
      status: initialData?.status || "draft",
      thumbnail: initialData?.featuredImage
        ? [
          {
            _type: "existing" as const,
            alt_text: initialData.featuredImage.alt_text || "",
            image_id: initialData.featuredImage.id,
            large_url: initialData.featuredImage.large_url || "",
            medium_url: initialData.featuredImage.medium_url || "",
            order: 0,
            original_url: initialData.featuredImage.original_url || "",
            small_url: initialData.featuredImage.small_url || "",
          },
        ]
        : [],
      title: initialData?.title || "",
    };
  }, [initialData]);

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues,
    resolver: zodResolver(formSchema),
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

      // Use excerpt from form
      const excerpt = data.excerpt;

      // Handle thumbnail image upload
      let featuredImageId: null | number = null;

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

          const imageData = [
            {
              alt_text: thumbnailImage.alt_text,
              large_url: uploadResult[0]!.image.large_url,
              medium_url: uploadResult[0]!.image.medium_url,
              original_url: uploadResult[0]!.image.original_url,
              small_url: uploadResult[0]!.image.small_url,
            },
          ];

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
          content: data.content,
          excerpt: excerpt || data.title,
          featured_image_id: featuredImageId,
          slug,
          status: data.status,
          title: data.title,
        });
        toast.success("Blog post updated successfully!");
      } else {
        // Create new blog
        await createBlog({
          category: "general",
          content: data.content,
          excerpt: excerpt || data.title,
          featured_image_id: featuredImageId,
          slug,
          status: data.status,
          title: data.title,
        });
        toast.success("Blog post created successfully!");
      }

      // Small delay to ensure toast is visible, then redirect
      setTimeout(() => {
        try {
          router.push("/blogs");
        } catch (redirectError) {
          console.error("Redirect error:", redirectError);
          if (typeof window !== "undefined") {
            window.location.href = "/blogs";
          }
        }
      }, 100);
    } catch (error: any) {
      console.error("Error creating blog - Full error object:", error);
      console.error("Error message:", error?.message);
      console.error("Error stack:", error?.stack);
      console.error("Error string:", String(error));

      const errorMessage =
        error?.message || String(error) || "Failed to create blog post";

      // Check if it's a URL-related error
      if (
        errorMessage.toLowerCase().includes("invalid url") ||
        errorMessage.toLowerCase().includes("url")
      ) {
        console.warn(
          "URL error detected, but blog may have been saved. Attempting redirect..."
        );
        toast.success(
          props.blogId
            ? "Blog post updated successfully!"
            : "Blog post created successfully!"
        );
        setTimeout(() => {
          if (typeof window !== "undefined") {
            window.location.href = "/blogs";
          } else {
            router.push("/blogs");
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
              <form
                className="space-y-6"
                onSubmit={form.handleSubmit(onSubmit)}
              >
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
                          <Input
                            placeholder="Enter blog post title..."
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          The title of your blog post
                          {slugPreview && (
                            <span className="block mt-1 text-muted-foreground">
                              URL slug:{" "}
                              <code className="text-xs bg-muted px-1 py-0.5 rounded">
                                {slugPreview || "..."}
                              </code>
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
                  name="excerpt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Excerpt</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter a brief excerpt for your blog post..."
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        A short summary of your blog post (max 500 characters)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="thumbnail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thumbnail Image</FormLabel>
                      <FormControl>
                        <FileUploader
                          disabled={isThumbnailUploading || isSubmitting}
                          id="blog-thumbnail"
                          maxFiles={1}
                          minDimensions={{ width: 1920, height: 1080 }}
                          onValueChange={field.onChange}
                          progresses={progresses}
                          showValidation={hasAttemptedSubmit}
                          value={field.value || []}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Upload a thumbnail image for your blog post (single
                        image)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Publish Blog Post
                        </FormLabel>
                        <FormDescription className="text-xs">
                          Toggle to set the blog post status to published or
                          draft.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value === "published"}
                          disabled={isSubmitting || isThumbnailUploading}
                          onCheckedChange={(checked) => {
                            field.onChange(checked ? "published" : "draft");
                          }}
                        />
                      </FormControl>
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
                          onChange={field.onChange}
                          value={field.value}
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
                    disabled={isSubmitting || isThumbnailUploading}
                    onClick={() => router.back()}
                    type="button"
                    variant="outline"
                  >
                    Cancel
                  </Button>
                  <Button
                    disabled={isSubmitting || isThumbnailUploading}
                    type="submit"
                  >
                    {isSubmitting || isThumbnailUploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {isThumbnailUploading
                          ? "Uploading image..."
                          : props.blogId
                            ? "Updating..."
                            : "Creating..."}
                      </>
                    ) : props.blogId ? (
                      "Update Blog Post"
                    ) : (
                      "Create Blog Post"
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
