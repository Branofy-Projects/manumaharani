"use client";

import { zodResolver } from "@/lib/zod-resolver";
import { createAttraction, updateAttraction } from "@repo/actions";
import { createImages } from "@repo/actions/images.actions";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import type { FormImage as FileUploaderFormImage } from "@/components/file-uploader";
import { FileUploader, hasValidImages } from "@/components/file-uploader";
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

import type { TAttraction } from "@repo/db";

const formSchema = z.object({
  title: z.string().min(1, "Title is required.").max(255),
  subtitle: z.string().min(1, "Subtitle is required."),
  link: z.string().default("#"),
  active: z.boolean().default(true),
  order: z.preprocess((val) => Number(val), z.number().int().default(0)),
  image: ImagesArraySchema(0, 1),
});

type TAttractionFormProps = {
  attractionId?: string;
  initialData: TAttraction | null;
  pageTitle: string;
};

const AttractionForm = (props: TAttractionFormProps) => {
  const { initialData, pageTitle } = props;
  const router = useRouter();

  const defaultValues = useMemo(() => {
    return {
      title: initialData?.title || "",
      subtitle: initialData?.subtitle || "",
      link: initialData?.link || "#",
      active: initialData?.active ?? true,
      order: initialData?.order || 0,
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

    if (data.image && data.image.length > 0 && !hasValidImage) {
      toast.error("Please add alt text to the image");
      return;
    }

    try {
      setIsSubmitting(true);

      let imageId: null | number = null;

      if (data.image && data.image.length > 0) {
        const selectedImage = data.image[0]!;

        if (selectedImage._type === "new") {
          setIsImageUploading(true);

          const uploadResult = await uploadFilesWithProgress(
            [selectedImage.file],
            (progressMap: Record<string, number>) => {
              setProgresses(progressMap);
            },
            "/api/v1/upload-image"
          );

          const imageData = [
            {
              alt_text: selectedImage.alt_text,
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
          imageId = selectedImage.image_id;
        }
      }

      const attractionData = {
        title: data.title,
        subtitle: data.subtitle,
        link: data.link,
        active: data.active,
        order: data.order,
        image: imageId,
      };

      if (props.attractionId) {
        await updateAttraction(props.attractionId, attractionData);
        toast.success("Attraction updated successfully!");
      } else {
        await createAttraction(attractionData);
        toast.success("Attraction created successfully!");
      }

      setTimeout(() => {
        router.push("/nearby-attractions");
        router.refresh();
      }, 100);
    } catch (error: any) {
      console.error("Error saving attraction:", error);
      toast.error(error?.message || "Failed to save attraction");
    } finally {
      setIsSubmitting(false);
      setIsImageUploading(false);
    }
  };

  return (
    <Card className="mx-auto w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="text-left text-2xl font-bold">
          {pageTitle}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter attraction title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Order</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormDescription>Lower numbers appear first</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="subtitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subtitle / Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter a brief description"
                      className="min-h-[100px]"
                      {...field}
                    />
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
                  <FormLabel>External Link (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="#" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Attraction Image</FormLabel>
                  <FormControl>
                    <FileUploader
                      disabled={isImageUploading || isSubmitting}
                      id="attraction-image"
                      maxFiles={1}
                      onValueChange={field.onChange}
                      progresses={progresses}
                      showValidation={hasAttemptedSubmit}
                      value={field.value || []}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active Status</FormLabel>
                    <FormDescription>
                      Inactive attractions will not be shown on the website.
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

            <div className="flex items-center gap-4">
              <Button
                type="submit"
                disabled={isSubmitting || isImageUploading}
                className="w-full sm:w-auto"
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {props.attractionId ? "Update Attraction" : "Create Attraction"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/nearby-attractions")}
                disabled={isSubmitting || isImageUploading}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AttractionForm;
