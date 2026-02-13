"use client";

import { createAttraction, syncAttractionImages, updateAttraction } from "@repo/actions";
import { createImages } from "@repo/actions/images.actions";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import type { FormImage as FileUploaderFormImage } from "@/components/file-uploader";

import { FileUploader, hasValidImages } from "@/components/file-uploader";
import PageContainer from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ImagesArraySchema } from "@/lib/image-schema";
import { uploadFilesWithProgress } from "@/lib/upload-files";
import { zodResolver } from "@/lib/zod-resolver";

import type { TAttraction } from "@repo/db";

const faqItemSchema = z.object({
  answer: z.string().optional().default(""),
  question: z.string().optional().default(""),
});

const formSchema = z.object({
  active: z.boolean().default(true),
  close_time: z.string().max(20).optional().default(""),
  description: z.string().optional().default(""),
  distance: z.string().max(100).optional().default(""),
  faqs: z.array(faqItemSchema).default([]),
  image: ImagesArraySchema(0, 1),
  images: ImagesArraySchema(0, 20),
  link: z.string().default("#"),
  open_time: z.string().max(20).optional().default(""),
  order: z.preprocess((val) => Number(val), z.number().int().default(0)),
  slug: z.string().min(1, "Slug is required.").max(255),
  subtitle: z.string().min(1, "Subtitle is required."),
  title: z.string().min(1, "Title is required.").max(255),
});

type TAttractionFormProps = {
  attractionId?: string;
  initialData: null | TAttraction;
  pageTitle: string;
};

const AttractionForm = (props: TAttractionFormProps) => {
  const { initialData, pageTitle } = props;
  const router = useRouter();

  const defaultValues = useMemo(() => {
    let faqs: Array<{ answer: string; question: string; }> = [];
    if (initialData?.faq) {
      try {
        const parsed = JSON.parse(initialData.faq) as unknown;
        faqs = Array.isArray(parsed)
          ? parsed.map((item: { answer?: string; question?: string; }) => ({
            answer: item?.answer ?? "",
            question: item?.question ?? "",
          }))
          : [];
      } catch {
        faqs = [];
      }
    }
    return {
      active: initialData?.active ?? true,
      close_time: initialData?.close_time ?? "",
      description: initialData?.description ?? "",
      distance: initialData?.distance ?? "",
      faqs,
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
      images: initialData?.images?.map((img, idx) => ({
        _type: "existing" as const,
        alt_text: img.image.alt_text || "",
        image_id: img.image.id,
        large_url: img.image.large_url || "",
        medium_url: img.image.medium_url || "",
        order: idx,
        original_url: img.image.original_url || "",
        small_url: img.image.small_url || "",
      })) || [],
      link: initialData?.link || "#",
      open_time: initialData?.open_time ?? "",
      order: initialData?.order || 0,
      slug: initialData?.slug || "",
      subtitle: initialData?.subtitle || "",
      title: initialData?.title || "",
    };
  }, [initialData]);

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues,
    resolver: zodResolver(formSchema),
  });

  const { append: appendFaq, fields: faqFields, remove: removeFaq } = useFieldArray({
    control: form.control,
    name: "faqs",
  });

  const [activeTab, setActiveTab] = useState("basic");
  const [progresses, setProgresses] = useState<Record<string, number>>({});
  const [galleryProgresses, setGalleryProgresses] = useState<Record<string, number>>({});
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [isGalleryUploading, setIsGalleryUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  const image = form.watch("image");
  const galleryImages = form.watch("images");
  const hasValidImage = useMemo(() => {
    return hasValidImages(image as FileUploaderFormImage[]);
  }, [image]);
  const hasValidGallery = useMemo(
    () => !galleryImages?.length || hasValidImages(galleryImages as FileUploaderFormImage[]),
    [galleryImages]
  );

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setHasAttemptedSubmit(true);

    if (data.image && data.image.length > 0 && !hasValidImage) {
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
            const [created] = await createImages([
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

      const attractionData = {
        active: data.active,
        close_time: data.close_time || null,
        description: data.description || null,
        distance: data.distance || null,
        faq: (() => {
          const valid = data.faqs?.filter((f) => f.question?.trim() && f.answer?.trim()) ?? [];
          return valid.length ? JSON.stringify(valid) : null;
        })(),
        image: imageId,
        link: data.link,
        open_time: data.open_time || null,
        order: data.order,
        slug: data.slug,
        subtitle: data.subtitle,
        title: data.title,
      };

      if (props.attractionId) {
        await updateAttraction(props.attractionId, attractionData);
        await syncAttractionImages(props.attractionId, galleryPayload);
        toast.success("Attraction updated successfully!");
      } else {
        const created = await createAttraction(attractionData);
        if (created?.id) {
          await syncAttractionImages(created.id, galleryPayload);
        }
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
                  disabled={busy}
                  onClick={() => router.push("/nearby-attractions")}
                  type="button"
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button disabled={busy} type="submit">
                  {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {props.attractionId ? "Update Attraction" : "Create Attraction"}
                </Button>
              </div>
            </div>

            <Tabs className="w-full" onValueChange={setActiveTab} value={activeTab}>
              <TabsList className="grid sticky top-0 z-10 w-full grid-cols-3">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="media">Media</TabsTrigger>
                <TabsTrigger value="faq">FAQ</TabsTrigger>
              </TabsList>

              {/* Tab: Basic Info */}
              <TabsContent className="space-y-6" value="basic">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>
                      Title, description, image, hours, and status
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter attraction title"
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e);
                                  if (!props.attractionId) {
                                    const slug = e.target.value
                                      .toLowerCase()
                                      .replace(/[^a-z0-9\s-]/g, "")
                                      .replace(/\s+/g, "-")
                                      .replace(/-+/g, "-")
                                      .trim();
                                    form.setValue("slug", slug);
                                  }
                                }}
                              />
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
                              <Input placeholder="auto-generated-from-title" {...field} />
                            </FormControl>
                            <FormDescription className="text-xs">URL-friendly identifier (auto-generated from title)</FormDescription>
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
                          <FormLabel>Subtitle</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter a brief subtitle" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description (Optional)</FormLabel>
                          <FormControl>
                            <Textarea className="min-h-[120px]" placeholder="Enter a detailed description for the detail page" {...field} />
                          </FormControl>
                          <FormDescription className="text-xs">Shown on the attraction detail page. Falls back to subtitle if empty.</FormDescription>
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
                          <FormDescription className="text-xs">Lower numbers appear first</FormDescription>
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
                      name="distance"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Distance (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. 2.5 km, 10 min drive" {...field} />
                          </FormControl>
                          <FormDescription className="text-xs">Distance from the property</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="open_time"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Open time (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. 09:00 or 9 AM" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="close_time"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Close time (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. 18:00 or 6 PM" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

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
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
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
                      Featured image and gallery photos
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="image"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Featured Image</FormLabel>
                          <FormControl>
                            <FileUploader
                              disabled={busy}
                              id="attraction-image"
                              maxFiles={1}
                              onValueChange={field.onChange}
                              progresses={progresses}
                              showValidation={hasAttemptedSubmit}
                              value={field.value || []}
                            />
                          </FormControl>
                          <FormDescription className="text-xs">Main image shown on listing cards</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="images"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gallery Images</FormLabel>
                          <FormControl>
                            <FileUploader
                              disabled={busy}
                              id="attraction-gallery-images"
                              maxFiles={20}
                              onValueChange={field.onChange}
                              progresses={galleryProgresses}
                              showValidation={hasAttemptedSubmit}
                              value={field.value || []}
                            />
                          </FormControl>
                          <FormDescription className="text-xs">Additional photos shown on the detail page gallery (up to 20)</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tab: FAQ */}
              <TabsContent className="space-y-6" value="faq">
                <Card>
                  <CardHeader>
                    <CardTitle>FAQ</CardTitle>
                    <CardDescription>
                      Add or remove frequently asked questions for this attraction
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-end">
                      <Button
                        onClick={() => appendFaq({ answer: "", question: "" })}
                        size="sm"
                        type="button"
                        variant="outline"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add FAQ
                      </Button>
                    </div>
                    {faqFields.map((field, index) => (
                      <div className="rounded-lg border p-4 space-y-3" key={field.id}>
                        <div className="flex justify-end">
                          <Button
                            onClick={() => removeFaq(index)}
                            size="icon"
                            type="button"
                            variant="ghost"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                        <FormField
                          control={form.control}
                          name={`faqs.${index}.question`}
                          render={({ field: f }) => (
                            <FormItem>
                              <FormLabel>Question</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. What are the opening hours?" {...f} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`faqs.${index}.answer`}
                          render={({ field: f }) => (
                            <FormItem>
                              <FormLabel>Answer</FormLabel>
                              <FormControl>
                                <Textarea className="min-h-[80px]" placeholder="Answer..." {...f} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    ))}
                    {faqFields.length === 0 && (
                      <p className="text-sm text-muted-foreground">No FAQs yet. Click &quot;Add FAQ&quot; to add one.</p>
                    )}
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

export default AttractionForm;