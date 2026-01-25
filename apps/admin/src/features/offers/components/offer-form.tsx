"use client";
import { createOffer, updateOffer } from "@repo/actions";
import { createImages } from "@repo/actions/images.actions";
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

import type { TOffer } from "@repo/db/schema/types.schema";

const formSchema = z.object({
  active: z.boolean().default(false),
  description: z.string().min(1, "Description is required."),
  excerpt: z.string().min(1, "Excerpt is required.").max(500),
  image: ImagesArraySchema(0, 1),
  link: z.string().min(1, "Link is required."),
  name: z.string().min(1, "Name is required.").max(255),
});

type TOfferFormProps = {
  initialData: ({ image?: any } & TOffer) | null;
  offerId?: string;
  pageTitle: string;
};

const OfferForm = (props: TOfferFormProps) => {
  const { initialData, pageTitle } = props;

  const router = useRouter();

  const defaultValues = useMemo(() => {
    return {
      active: initialData?.active || false,
      description: initialData?.description || "",
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
      link: initialData?.link || "",
      name: initialData?.name || "",
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

      // Create or update offer
      if (props.offerId) {
        // Update existing offer
        await updateOffer(props.offerId, {
          active: data.active,
          description: data.description,
          excerpt: data.excerpt,
          image: imageId,
          link: data.link,
          name: data.name,
        });
        toast.success("Offer updated successfully!");
      } else {
        // Create new offer
        await createOffer({
          active: data.active,
          description: data.description,
          excerpt: data.excerpt,
          image: imageId,
          link: data.link,
          name: data.name,
        });
        toast.success("Offer created successfully!");
      }

      // Small delay to ensure toast is visible, then redirect
      setTimeout(() => {
        router.push("/offers");
      }, 100);
    } catch (error: any) {
      console.error("Error creating offer:", error);
      toast.error(error?.message || "Failed to create offer");
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
                  name="active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Active Offer</FormLabel>
                        <FormDescription>
                          Enable this to make the offer visible to users.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter offer name..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="link"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Link</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter offer link..." {...field} />
                      </FormControl>
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
                          placeholder="Enter a brief excerpt for your offer..."
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        A short summary of your offer (max 500 characters)
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
                          id="offer-image"
                          maxFiles={1}
                          onValueChange={field.onChange}
                          progresses={progresses}
                          showValidation={hasAttemptedSubmit}
                          value={field.value || []}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Upload an image for your offer (single image)
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
                        Write your offer description using the rich text editor
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
                          : props.offerId
                            ? "Updating..."
                            : "Creating..."}
                      </>
                    ) : props.offerId ? (
                      "Update Offer"
                    ) : (
                      "Create Offer"
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

export default OfferForm;
