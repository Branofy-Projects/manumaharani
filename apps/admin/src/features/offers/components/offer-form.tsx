"use client";

import {
  createOffer,
  syncOfferHighlights,
  syncOfferImages,
  syncOfferItinerary,
  updateOffer,
} from "@repo/actions";
import { createImages } from "@repo/actions/images.actions";
import {
  GripVertical,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import type { FormImage as FileUploaderFormImage } from "@/components/file-uploader";

import { FileUploader, hasValidImages } from "@/components/file-uploader";
import PageContainer from "@/components/layout/page-container";
import { RichTextEditor } from "@/components/rich-text-editor";
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

import type { TOfferWithDetails } from "@repo/db/schema/types.schema";

const CATEGORIES = [
  { label: "Experience", value: "experience" },
  { label: "Package", value: "package" },
  { label: "Dining", value: "dining" },
  { label: "Spa & Wellness", value: "spa" },
  { label: "Adventure", value: "adventure" },
  { label: "Cultural", value: "cultural" },
  { label: "Romantic", value: "romantic" },
  { label: "Family", value: "family" },
] as const;

const STATUS_OPTIONS = [
  { label: "Draft", value: "draft" },
  { label: "Active", value: "active" },
  { label: "Expired", value: "expired" },
  { label: "Archived", value: "archived" },
] as const;

const PRICE_PER_OPTIONS = [
  { label: "Per Person", value: "person" },
  { label: "Per Couple", value: "couple" },
  { label: "Per Group", value: "group" },
  { label: "Per Night", value: "night" },
] as const;

const highlightSchema = z.object({
  order: z.number().optional(),
  text: z.string().min(1, "Highlight text is required"),
  type: z.enum(["included", "excluded"]),
});

const itinerarySchema = z.object({
  admission_included: z.boolean().optional(),
  description: z.string().optional(),
  duration: z.string().optional(),
  is_stop: z.boolean().optional(),
  location: z.string().optional(),
  order: z.number().optional(),
  title: z.string().min(1, "Title is required"),
});

const formSchema = z.object({
  // Basic Info
  active: z.boolean().default(false),
  category: z.enum(["experience", "package", "dining", "spa", "adventure", "cultural", "romantic", "family"]),
  description: z.string().min(1, "Description is required."),
  excerpt: z.string().min(1, "Excerpt is required.").max(500),
  name: z.string().min(1, "Name is required.").max(255),
  slug: z.string().min(1, "Slug is required.").max(255),
  status: z.enum(["draft", "active", "expired", "archived"]),

  // Pricing
  discounted_price: z.string().optional(),
  original_price: z.string().optional(),
  price_per: z.string().optional(),

  // Details
  booking_notice: z.string().optional(),
  duration: z.string().optional(),
  languages: z.string().optional(),
  link: z.string().min(1, "Link is required."),
  location: z.string().optional(),
  max_group_size: z.number().optional(),
  meeting_point: z.string().optional(),
  meeting_point_details: z.string().optional(),
  min_group_size: z.number().optional(),

  // Cancellation
  cancellation_deadline: z.string().optional(),
  cancellation_policy: z.string().optional(),
  free_cancellation: z.boolean().optional(),

  // SEO
  meta_description: z.string().optional(),
  meta_title: z.string().optional(),

  // Reviews (usually not editable, but included for completeness)
  rating: z.string().optional(),
  review_count: z.number().optional(),

  // Media
  gallery_images: ImagesArraySchema(1, 20),
  image: ImagesArraySchema(0, 1),

  // Highlights
  highlights: z.array(highlightSchema).optional(),

  // Itinerary
  itinerary: z.array(itinerarySchema).optional(),
});

type TOfferFormProps = {
  initialData: null | TOfferWithDetails;
  offerId?: string;
  pageTitle: string;
};

const OfferForm = (props: TOfferFormProps) => {
  const { initialData, pageTitle } = props;
  const router = useRouter();

  const defaultValues = useMemo(() => {
    return {
      // Basic Info
      active: initialData?.active || false,
      category: initialData?.category || "experience",
      description: initialData?.description || "",
      excerpt: initialData?.excerpt || "",
      name: initialData?.name || "",
      slug: initialData?.slug || "",
      status: initialData?.status || "draft",

      // Pricing
      discounted_price: initialData?.discounted_price || "",
      original_price: initialData?.original_price || "",
      price_per: initialData?.price_per || "person",

      // Details
      booking_notice: initialData?.booking_notice || "",
      duration: initialData?.duration || "",
      languages: initialData?.languages || "",
      link: initialData?.link || "",
      location: initialData?.location || "",
      max_group_size: initialData?.max_group_size || undefined,
      meeting_point: initialData?.meeting_point || "",
      meeting_point_details: initialData?.meeting_point_details || "",
      min_group_size: initialData?.min_group_size || 1,

      // Cancellation
      cancellation_deadline: initialData?.cancellation_deadline || "",
      cancellation_policy: initialData?.cancellation_policy || "",
      free_cancellation: initialData?.free_cancellation || false,

      // SEO
      meta_description: initialData?.meta_description || "",
      meta_title: initialData?.meta_title || "",

      // Reviews
      rating: initialData?.rating || "",
      review_count: initialData?.review_count || 0,

      // Media
      gallery_images: initialData?.images?.map((img, index) => ({
        _type: "existing" as const,
        alt_text: img.image.alt_text || "",
        image_id: img.image.id,
        large_url: img.image.large_url || "",
        medium_url: img.image.medium_url || "",
        order: img.order ?? index,
        original_url: img.image.original_url || "",
        small_url: img.image.small_url || "",
      })) || [],
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

      // Highlights
      highlights: initialData?.highlights?.map((h) => ({
        order: h.order,
        text: h.text,
        type: h.type as "excluded" | "included",
      })) || [],

      // Itinerary
      itinerary: initialData?.itinerary?.map((i) => ({
        admission_included: i.admission_included || false,
        description: i.description || "",
        duration: i.duration || "",
        is_stop: i.is_stop ?? true,
        location: i.location || "",
        order: i.order,
        title: i.title,
      })) || [],
    };
  }, [initialData]);

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues,
    resolver: zodResolver(formSchema),
  });

  const {
    append: appendHighlight,
    fields: highlightFields,
    remove: removeHighlight,
  } = useFieldArray({
    control: form.control,
    name: "highlights",
  });

  const {
    append: appendItinerary,
    fields: itineraryFields,
    remove: removeItinerary,
  } = useFieldArray({
    control: form.control,
    name: "itinerary",
  });

  const [progresses, setProgresses] = useState<Record<string, number>>({});
  const [galleryProgresses, setGalleryProgresses] = useState<Record<string, number>>({});
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [isGalleryUploading, setIsGalleryUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [currentOfferId, setCurrentOfferId] = useState<string | undefined>(props.offerId);

  const image = form.watch("image");
  const galleryImages = form.watch("gallery_images");

  const hasValidImage = useMemo(() => {
    return hasValidImages(image as FileUploaderFormImage[]);
  }, [image]);

  const hasValidGalleryImages = useMemo(() => {
    return hasValidImages(galleryImages as FileUploaderFormImage[]);
  }, [galleryImages]);

  // Auto-generate slug from name
  const watchName = form.watch("name");
  const generateSlug = () => {
    const slug = watchName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    form.setValue("slug", slug);
  };

  // Helper function to ensure offer exists (create if needed)
  const ensureOfferExists = async (): Promise<null | string> => {
    if (currentOfferId) {
      return currentOfferId;
    }

    // Create a minimal offer if it doesn't exist
    const formData = form.getValues();

    // Validate required fields for creating an offer
    if (!formData.name || !formData.slug || !formData.description || !formData.excerpt || !formData.link) {
      toast.error("Please fill in required fields (Name, Slug, Description, Excerpt, Link) before saving individual sections.");
      return null;
    }

    const minimalOfferData = {
      active: formData.active || false,
      booking_notice: formData.booking_notice || null,
      cancellation_deadline: formData.cancellation_deadline || null,
      cancellation_policy: formData.cancellation_policy || null,
      category: formData.category || "experience",
      description: formData.description,
      discounted_price: formData.discounted_price || null,
      duration: formData.duration || null,
      excerpt: formData.excerpt,
      free_cancellation: formData.free_cancellation || false,
      image: null,
      languages: formData.languages || null,
      link: formData.link,
      location: formData.location || null,
      max_group_size: formData.max_group_size || null,
      meeting_point: formData.meeting_point || null,
      meeting_point_details: formData.meeting_point_details || null,
      meta_description: formData.meta_description || null,
      meta_title: formData.meta_title || null,
      min_group_size: formData.min_group_size || 1,
      name: formData.name,
      original_price: formData.original_price || null,
      price_per: formData.price_per || "person",
      rating: formData.rating || null,
      review_count: formData.review_count || 0,
      slug: formData.slug,
      status: formData.status || "draft",
    };

    try {
      const newOffer = await createOffer(minimalOfferData);
      if (newOffer?.id) {
        setCurrentOfferId(newOffer.id);
        toast.success("Offer created! You can now save individual sections.");
        return newOffer.id;
      }
      return null;
    } catch (error) {
      console.error("Error creating offer:", error);
      toast.error("Failed to create offer. Please fill in required fields first.");
      return null;
    }
  };

  // Save Basic Info section
  const saveBasicInfo = async () => {
    const data = form.getValues();
    const offerId = await ensureOfferExists();
    if (!offerId) return;

    try {
      setIsSubmitting(true);
      await updateOffer(offerId, {
        active: data.active,
        booking_notice: data.booking_notice || null,
        cancellation_deadline: data.cancellation_deadline || null,
        cancellation_policy: data.cancellation_policy || null,
        category: data.category,
        description: data.description,
        discounted_price: data.discounted_price || null,
        duration: data.duration || null,
        excerpt: data.excerpt,
        free_cancellation: data.free_cancellation || false,
        image: null,
        languages: data.languages || null,
        link: data.link,
        location: data.location || null,
        max_group_size: data.max_group_size || null,
        meeting_point: data.meeting_point || null,
        meeting_point_details: data.meeting_point_details || null,
        meta_description: data.meta_description || null,
        meta_title: data.meta_title || null,
        min_group_size: data.min_group_size || 1,
        name: data.name,
        original_price: data.original_price || null,
        price_per: data.price_per || "person",
        rating: data.rating || null,
        review_count: data.review_count || 0,
        slug: data.slug,
        status: data.status,
      });
      toast.success("Basic info saved successfully!");
    } catch (error) {
      console.error("Error saving basic info:", error);
      toast.error(error instanceof Error ? error.message : "Failed to save basic info");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Save Details section
  const saveDetails = async () => {
    const data = form.getValues();
    const offerId = await ensureOfferExists();
    if (!offerId) return;

    try {
      setIsSubmitting(true);
      await updateOffer(offerId, {
        active: data.active || false,
        booking_notice: data.booking_notice || null,
        cancellation_deadline: data.cancellation_deadline || null,
        cancellation_policy: data.cancellation_policy || null,
        category: data.category || "experience",
        description: data.description || "",
        discounted_price: data.discounted_price || null,
        duration: data.duration || null,
        excerpt: data.excerpt || "",
        free_cancellation: data.free_cancellation || false,
        image: null,
        languages: data.languages || null,
        link: data.link || "#",
        location: data.location || null,
        max_group_size: data.max_group_size || null,
        meeting_point: data.meeting_point || null,
        meeting_point_details: data.meeting_point_details || null,
        meta_description: data.meta_description || null,
        meta_title: data.meta_title || null,
        min_group_size: data.min_group_size || 1,
        name: data.name || "",
        original_price: data.original_price || null,
        price_per: data.price_per || "person",
        rating: data.rating || null,
        review_count: data.review_count || 0,
        slug: data.slug || "",
        status: data.status || "draft",
      });
      toast.success("Details saved successfully!");
    } catch (error) {
      console.error("Error saving details:", error);
      toast.error(error instanceof Error ? error.message : "Failed to save details");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Save Pricing section
  const savePricing = async () => {
    const data = form.getValues();
    const offerId = await ensureOfferExists();
    if (!offerId) return;

    try {
      setIsSubmitting(true);
      await updateOffer(offerId, {
        active: data.active || false,
        booking_notice: data.booking_notice || null,
        cancellation_deadline: data.cancellation_deadline || null,
        cancellation_policy: data.cancellation_policy || null,
        category: data.category || "experience",
        description: data.description || "",
        discounted_price: data.discounted_price || null,
        duration: data.duration || null,
        excerpt: data.excerpt || "",
        free_cancellation: data.free_cancellation || false,
        image: null,
        languages: data.languages || null,
        link: data.link || "#",
        location: data.location || null,
        max_group_size: data.max_group_size || null,
        meeting_point: data.meeting_point || null,
        meeting_point_details: data.meeting_point_details || null,
        meta_description: data.meta_description || null,
        meta_title: data.meta_title || null,
        min_group_size: data.min_group_size || 1,
        name: data.name || "",
        original_price: data.original_price || null,
        price_per: data.price_per || "person",
        rating: data.rating || null,
        review_count: data.review_count || 0,
        slug: data.slug || "",
        status: data.status || "draft",
      });
      toast.success("Pricing saved successfully!");
    } catch (error) {
      console.error("Error saving pricing:", error);
      toast.error(error instanceof Error ? error.message : "Failed to save pricing");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Save Media section
  const saveMedia = async () => {
    const data = form.getValues();
    const offerId = await ensureOfferExists();
    if (!offerId) return;

    // Validate gallery images
    if (!data.gallery_images || data.gallery_images.length < 1) {
      toast.error("Please add at least 1 gallery image");
      return;
    }

    if (data.gallery_images && data.gallery_images.length > 0 && !hasValidGalleryImages) {
      toast.error("Please add alt text to all gallery images");
      return;
    }

    if (data.image && data.image.length > 0 && !hasValidImage) {
      toast.error("Please add alt text to the featured image");
      return;
    }

    try {
      setIsSubmitting(true);

      // Handle featured image upload
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

      // Update offer with featured image
      await updateOffer(offerId, {
        active: data.active || false,
        booking_notice: data.booking_notice || null,
        cancellation_deadline: data.cancellation_deadline || null,
        cancellation_policy: data.cancellation_policy || null,
        category: data.category || "experience",
        description: data.description || "",
        discounted_price: data.discounted_price || null,
        duration: data.duration || null,
        excerpt: data.excerpt || "",
        free_cancellation: data.free_cancellation || false,
        image: imageId,
        languages: data.languages || null,
        link: data.link || "#",
        location: data.location || null,
        max_group_size: data.max_group_size || null,
        meeting_point: data.meeting_point || null,
        meeting_point_details: data.meeting_point_details || null,
        meta_description: data.meta_description || null,
        meta_title: data.meta_title || null,
        min_group_size: data.min_group_size || 1,
        name: data.name || "",
        original_price: data.original_price || null,
        price_per: data.price_per || "person",
        rating: data.rating || null,
        review_count: data.review_count || 0,
        slug: data.slug || "",
        status: data.status || "draft",
      });

      // Handle gallery images upload
      const galleryImageIds: Array<{ caption?: string; image_id: number; order: number }> = [];

      if (data.gallery_images && data.gallery_images.length > 0) {
        setIsGalleryUploading(true);

        for (let i = 0; i < data.gallery_images.length; i++) {
          const galleryImage = data.gallery_images[i];

          if (galleryImage._type === "new") {
            const uploadResult = await uploadFilesWithProgress(
              [galleryImage.file],
              (progressMap: Record<string, number>) => {
                setGalleryProgresses(progressMap);
              },
              "/api/v1/upload-image"
            );

            const imageData = [
              {
                alt_text: galleryImage.alt_text,
                large_url: uploadResult[0]!.image.large_url,
                medium_url: uploadResult[0]!.image.medium_url,
                original_url: uploadResult[0]!.image.original_url,
                small_url: uploadResult[0]!.image.small_url,
              },
            ];

            const createdImages = await createImages(imageData);

            if (Array.isArray(createdImages) && createdImages.length > 0) {
              galleryImageIds.push({
                caption: galleryImage.alt_text,
                image_id: createdImages[0]!.id,
                order: i,
              });
            }
          } else {
            galleryImageIds.push({
              caption: galleryImage.alt_text,
              image_id: galleryImage.image_id,
              order: i,
            });
          }
        }

        setIsGalleryUploading(false);
      }

      // Sync gallery images
      if (galleryImageIds.length > 0) {
        await syncOfferImages(offerId, galleryImageIds);
      }

      toast.success("Media saved successfully!");
    } catch (error) {
      console.error("Error saving media:", error);
      toast.error(error instanceof Error ? error.message : "Failed to save media");
    } finally {
      setIsSubmitting(false);
      setIsImageUploading(false);
      setIsGalleryUploading(false);
    }
  };

  // Save Highlights section
  const saveHighlights = async () => {
    const data = form.getValues();
    const offerId = await ensureOfferExists();
    if (!offerId) return;

    try {
      setIsSubmitting(true);
      if (data.highlights && data.highlights.length > 0) {
        await syncOfferHighlights(offerId, data.highlights);
      }
      toast.success("Highlights saved successfully!");
    } catch (error) {
      console.error("Error saving highlights:", error);
      toast.error(error instanceof Error ? error.message : "Failed to save highlights");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Save Itinerary section
  const saveItinerary = async () => {
    const data = form.getValues();
    const offerId = await ensureOfferExists();
    if (!offerId) return;

    try {
      setIsSubmitting(true);
      if (data.itinerary && data.itinerary.length > 0) {
        await syncOfferItinerary(offerId, data.itinerary);
      }
      toast.success("Itinerary saved successfully!");
    } catch (error) {
      console.error("Error saving itinerary:", error);
      toast.error(error instanceof Error ? error.message : "Failed to save itinerary");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setHasAttemptedSubmit(true);

    // Validate featured image if provided
    if (data.image && data.image.length > 0 && !hasValidImage) {
      toast.error("Please add alt text to the featured image");
      return;
    }

    // Validate gallery images
    if (data.gallery_images && data.gallery_images.length > 0 && !hasValidGalleryImages) {
      toast.error("Please add alt text to all gallery images");
      return;
    }

    // Validate minimum gallery images
    if (!data.gallery_images || data.gallery_images.length < 1) {
      toast.error("Please add at least 1 gallery image");
      setActiveTab("media");
      return;
    }

    try {
      setIsSubmitting(true);

      // Handle featured image upload
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

      // Handle gallery images upload
      const galleryImageIds: Array<{ caption?: string; image_id: number; order: number }> = [];

      if (data.gallery_images && data.gallery_images.length > 0) {
        setIsGalleryUploading(true);

        for (let i = 0; i < data.gallery_images.length; i++) {
          const galleryImage = data.gallery_images[i];

          if (galleryImage._type === "new") {
            const uploadResult = await uploadFilesWithProgress(
              [galleryImage.file],
              (progressMap: Record<string, number>) => {
                setGalleryProgresses(progressMap);
              },
              "/api/v1/upload-image"
            );

            const imageData = [
              {
                alt_text: galleryImage.alt_text,
                large_url: uploadResult[0]!.image.large_url,
                medium_url: uploadResult[0]!.image.medium_url,
                original_url: uploadResult[0]!.image.original_url,
                small_url: uploadResult[0]!.image.small_url,
              },
            ];

            const createdImages = await createImages(imageData);

            if (Array.isArray(createdImages) && createdImages.length > 0) {
              galleryImageIds.push({
                caption: galleryImage.alt_text,
                image_id: createdImages[0]!.id,
                order: i,
              });
            }
          } else {
            galleryImageIds.push({
              caption: galleryImage.alt_text,
              image_id: galleryImage.image_id,
              order: i,
            });
          }
        }

        setIsGalleryUploading(false);
      }

      const offerData = {
        active: data.active,
        booking_notice: data.booking_notice || null,
        cancellation_deadline: data.cancellation_deadline || null,
        cancellation_policy: data.cancellation_policy || null,
        category: data.category,
        description: data.description,
        discounted_price: data.discounted_price || null,
        duration: data.duration || null,
        excerpt: data.excerpt,
        free_cancellation: data.free_cancellation || false,
        image: imageId,
        languages: data.languages || null,
        link: data.link,
        location: data.location || null,
        max_group_size: data.max_group_size || null,
        meeting_point: data.meeting_point || null,
        meeting_point_details: data.meeting_point_details || null,
        meta_description: data.meta_description || null,
        meta_title: data.meta_title || null,
        min_group_size: data.min_group_size || 1,
        name: data.name,
        original_price: data.original_price || null,
        price_per: data.price_per || "person",
        rating: data.rating || null,
        review_count: data.review_count || 0,
        slug: data.slug,
        status: data.status,
      };

      let offerId = props.offerId;

      if (props.offerId) {
        // Update existing offer
        await updateOffer(props.offerId, offerData);
        toast.success("Offer updated successfully!");
      } else {
        // Create new offer
        const newOffer = await createOffer(offerData);
        offerId = newOffer?.id;
        toast.success("Offer created successfully!");
      }

      // Sync gallery images if we have an offer ID
      if (offerId && galleryImageIds.length > 0) {
        await syncOfferImages(offerId, galleryImageIds);
      }

      // Sync highlights if we have an offer ID
      if (offerId && data.highlights && data.highlights.length > 0) {
        await syncOfferHighlights(offerId, data.highlights);
      }

      // Sync itinerary if we have an offer ID
      if (offerId && data.itinerary && data.itinerary.length > 0) {
        await syncOfferItinerary(offerId, data.itinerary);
      }

      // Small delay to ensure toast is visible, then redirect
      setTimeout(() => {
        router.push("/offers");
      }, 100);
    } catch (error) {
      console.error("Error saving offer:", error);
      toast.error(error instanceof Error ? error.message : "Failed to save offer");
    } finally {
      setIsSubmitting(false);
      setIsImageUploading(false);
      setIsGalleryUploading(false);
    }
  };

  return (
    <PageContainer scrollable={true}>
      <div className="w-full">
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">{pageTitle}</h1>
              <div className="flex gap-3">
                <Button
                  disabled={isSubmitting || isImageUploading || isGalleryUploading}
                  onClick={() => router.back()}
                  type="button"
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button disabled={isSubmitting || isImageUploading || isGalleryUploading} type="submit">
                  {isSubmitting || isImageUploading || isGalleryUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isImageUploading || isGalleryUploading
                        ? "Uploading images..."
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
            </div>

            <Tabs className="w-full" onValueChange={setActiveTab} value={activeTab}>
              <TabsList className="grid sticky top-0 z-10 w-full grid-cols-6">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="pricing">Pricing</TabsTrigger>
                <TabsTrigger value="media">Media</TabsTrigger>
                <TabsTrigger value="highlights">Highlights</TabsTrigger>
                <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
              </TabsList>

              {/* Basic Info Tab */}
              <TabsContent className="space-y-6" value="basic">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>
                      Core details about the offer
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="active"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Active</FormLabel>
                              <FormDescription>
                                Make this offer visible to users
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
                                {STATUS_OPTIONS.map((status) => (
                                  <SelectItem key={status.value} value={status.value}>
                                    {status.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

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

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="slug"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Slug</FormLabel>
                            <div className="flex gap-2">
                              <FormControl>
                                <Input placeholder="offer-slug" {...field} />
                              </FormControl>
                              <Button
                                onClick={generateSlug}
                                type="button"
                                variant="outline"
                              >
                                Generate
                              </Button>
                            </div>
                            <FormDescription>
                              URL-friendly identifier for the offer
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
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {CATEGORIES.map((cat) => (
                                  <SelectItem key={cat.value} value={cat.value}>
                                    {cat.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="link"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Booking Link</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="/book or https://..."
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            URL where users can book this offer
                          </FormDescription>
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
                              placeholder="Brief summary of the offer..."
                              rows={3}
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Short summary shown in listing cards (max 500 chars)
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
                          <FormDescription>
                            Full description of the offer
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* SEO Section */}
                <Card>
                  <CardHeader>
                    <CardTitle>SEO Settings</CardTitle>
                    <CardDescription>
                      Search engine optimization settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="meta_title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Meta Title</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="SEO title..."
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Title shown in search results (leave empty to use name)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="meta_description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Meta Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="SEO description..."
                              rows={2}
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Description shown in search results (leave empty to use excerpt)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Save Button for Basic Info Tab */}
                <div className="flex justify-end gap-3 border-t py-6">
                  <Button
                    disabled={isSubmitting || isImageUploading || isGalleryUploading}
                    onClick={saveBasicInfo}
                    type="button"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Basic Info"
                    )}
                  </Button>
                </div>
              </TabsContent>

              {/* Details Tab */}
              <TabsContent className="space-y-6" value="details">
                <Card>
                  <CardHeader>
                    <CardTitle>Offer Details</CardTitle>
                    <CardDescription>
                      Duration, location, and capacity information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="duration"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Duration</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., 8 hours, Full Day, 3 Days"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., Jim Corbett National Park"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="min_group_size"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Min Group Size</FormLabel>
                            <FormControl>
                              <Input
                                onChange={(e) =>
                                  field.onChange(parseInt(e.target.value) || 1)
                                }
                                placeholder="1"
                                type="number"
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="max_group_size"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Max Group Size</FormLabel>
                            <FormControl>
                              <Input
                                onChange={(e) =>
                                  field.onChange(parseInt(e.target.value) || undefined)
                                }
                                placeholder="e.g., 10"
                                type="number"
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="languages"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Languages</FormLabel>
                          <FormControl>
                            <Input
                              placeholder='["English", "Hindi"]'
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            JSON array of languages offered
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="meeting_point"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Meeting Point</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Hotel Lobby"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="meeting_point_details"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Meeting Point Details</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Additional details about the meeting point..."
                              rows={3}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="booking_notice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Booking Notice</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="e.g., Book at least 48 hours in advance..."
                              rows={2}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Cancellation Section */}
                <Card>
                  <CardHeader>
                    <CardTitle>Cancellation Policy</CardTitle>
                    <CardDescription>
                      Define the cancellation terms
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="free_cancellation"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Free Cancellation
                            </FormLabel>
                            <FormDescription>
                              Offer free cancellation to customers
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
                      name="cancellation_deadline"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cancellation Deadline</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., 24 hours before, 72 hours"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="cancellation_policy"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cancellation Policy Details</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Full cancellation policy text..."
                              rows={4}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Save Button for Details Tab */}
                <div className="flex justify-end gap-3 border-t py-6">
                  <Button
                    disabled={isSubmitting || isImageUploading || isGalleryUploading}
                    onClick={saveDetails}
                    type="button"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Details"
                    )}
                  </Button>
                </div>
              </TabsContent>

              {/* Pricing Tab */}
              <TabsContent className="space-y-6" value="pricing">
                <Card>
                  <CardHeader>
                    <CardTitle>Pricing</CardTitle>
                    <CardDescription>
                      Set the offer pricing
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="original_price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Original Price (₹)</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., 10000"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Original price (shown as strikethrough)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="discounted_price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Discounted Price (₹)</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., 7999"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Sale price (main displayed price)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="price_per"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price Per</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select..." />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {PRICE_PER_OPTIONS.map((opt) => (
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

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="rating"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Rating</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., 4.8"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Average rating (1-5)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="review_count"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Review Count</FormLabel>
                            <FormControl>
                              <Input
                                onChange={(e) =>
                                  field.onChange(parseInt(e.target.value) || 0)
                                }
                                placeholder="e.g., 247"
                                type="number"
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Save Button for Pricing Tab */}
                <div className="flex justify-end gap-3 border-t py-6">
                  <Button
                    disabled={isSubmitting || isImageUploading || isGalleryUploading}
                    onClick={savePricing}
                    type="button"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Pricing"
                    )}
                  </Button>
                </div>
              </TabsContent>

              {/* Media Tab */}
              <TabsContent className="space-y-6" value="media">
                <Card>
                  <CardHeader>
                    <CardTitle>Featured Image</CardTitle>
                    <CardDescription>
                      Main image for the offer (optional - displayed in listings)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="image"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <FileUploader
                              disabled={isImageUploading || isGalleryUploading || isSubmitting}
                              id="offer-image"
                              maxFiles={1}
                              onValueChange={field.onChange}
                              progresses={progresses}
                              showValidation={hasAttemptedSubmit}
                              value={field.value || []}
                            />
                          </FormControl>
                          <FormDescription>
                            Upload the main image for this offer (shown in listings)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Gallery Images *</CardTitle>
                    <CardDescription>
                      Upload images for the offer gallery (minimum 1, maximum 20 images)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="gallery_images"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <FileUploader
                              disabled={isImageUploading || isGalleryUploading || isSubmitting}
                              id="offer-gallery"
                              maxFiles={20}
                              onValueChange={field.onChange}
                              progresses={galleryProgresses}
                              showValidation={hasAttemptedSubmit}
                              value={field.value || []}
                            />
                          </FormControl>
                          <FormDescription>
                            These images will be displayed in the gallery on the offer detail page.
                            Add between 1-20 images. The first image will be used as the main gallery image.
                          </FormDescription>
                          <FormMessage />
                          {hasAttemptedSubmit && (!field.value || field.value.length < 1) && (
                            <p className="text-sm font-medium text-destructive">
                              At least 1 gallery image is required
                            </p>
                          )}
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Save Button for Media Tab */}
                <div className="flex justify-end gap-3 border-t py-6">
                  <Button
                    disabled={isSubmitting || isImageUploading || isGalleryUploading}
                    onClick={saveMedia}
                    type="button"
                  >
                    {isSubmitting || isImageUploading || isGalleryUploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {isImageUploading || isGalleryUploading
                          ? "Uploading images..."
                          : "Saving..."}
                      </>
                    ) : (
                      "Save Media"
                    )}
                  </Button>
                </div>
              </TabsContent>

              {/* Highlights Tab */}
              <TabsContent className="space-y-6" value="highlights">
                <Card>
                  <CardHeader>
                    <CardTitle>What&apos;s Included / Excluded</CardTitle>
                    <CardDescription>
                      List what is and isn&apos;t included in this offer
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {highlightFields.map((field, index) => (
                      <div
                        className="flex items-start gap-3 rounded-lg border p-4"
                        key={field.id}
                      >
                        <GripVertical className="mt-2 h-5 w-5 cursor-grab text-muted-foreground" />
                        <div className="flex-1 space-y-3">
                          <div className="flex gap-3">
                            <FormField
                              control={form.control}
                              name={`highlights.${index}.type`}
                              render={({ field }) => (
                                <FormItem className="w-[150px]">
                                  <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="included">
                                        ✓ Included
                                      </SelectItem>
                                      <SelectItem value="excluded">
                                        ✗ Excluded
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`highlights.${index}.text`}
                              render={({ field }) => (
                                <FormItem className="flex-1">
                                  <FormControl>
                                    <Input
                                      placeholder="e.g., Professional guide included"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                        <Button
                          className="mt-1"
                          onClick={() => removeHighlight(index)}
                          size="icon"
                          type="button"
                          variant="ghost"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}

                    <Button
                      className="w-full"
                      onClick={() =>
                        appendHighlight({
                          order: highlightFields.length,
                          text: "",
                          type: "included",
                        })
                      }
                      type="button"
                      variant="outline"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Highlight
                    </Button>
                  </CardContent>
                </Card>

                {/* Save Button for Highlights Tab */}
                <div className="flex justify-end gap-3 border-t py-6">
                  <Button
                    disabled={isSubmitting || isImageUploading || isGalleryUploading}
                    onClick={saveHighlights}
                    type="button"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Highlights"
                    )}
                  </Button>
                </div>
              </TabsContent>

              {/* Itinerary Tab */}
              <TabsContent className="space-y-6" value="itinerary">
                <Card>
                  <CardHeader>
                    <CardTitle>Itinerary / What to Expect</CardTitle>
                    <CardDescription>
                      Define the timeline of activities
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {itineraryFields.map((field, index) => (
                      <div
                        className="rounded-lg border p-4"
                        key={field.id}
                      >
                        <div className="mb-3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <GripVertical className="h-5 w-5 cursor-grab text-muted-foreground" />
                            <span className="font-medium">
                              Stop {index + 1}
                            </span>
                          </div>
                          <Button
                            onClick={() => removeItinerary(index)}
                            size="icon"
                            type="button"
                            variant="ghost"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>

                        <div className="space-y-3">
                          <FormField
                            control={form.control}
                            name={`itinerary.${index}.title`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="e.g., Pick-up from Hotel"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="grid grid-cols-2 gap-3">
                            <FormField
                              control={form.control}
                              name={`itinerary.${index}.duration`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Duration</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="e.g., 30 minutes"
                                      {...field}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`itinerary.${index}.location`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Location</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="e.g., Hotel Lobby"
                                      {...field}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={form.control}
                            name={`itinerary.${index}.description`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Describe what happens at this stop..."
                                    rows={2}
                                    {...field}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />

                          <div className="flex gap-6">
                            <FormField
                              control={form.control}
                              name={`itinerary.${index}.is_stop`}
                              render={({ field }) => (
                                <FormItem className="flex items-center gap-2">
                                  <FormControl>
                                    <Switch
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                  <FormLabel className="!mt-0">
                                    Is a Stop (vs Pass-by)
                                  </FormLabel>
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`itinerary.${index}.admission_included`}
                              render={({ field }) => (
                                <FormItem className="flex items-center gap-2">
                                  <FormControl>
                                    <Switch
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                  <FormLabel className="!mt-0">
                                    Admission Included
                                  </FormLabel>
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    <Button
                      className="w-full"
                      onClick={() =>
                        appendItinerary({
                          admission_included: false,
                          description: "",
                          duration: "",
                          is_stop: true,
                          location: "",
                          order: itineraryFields.length,
                          title: "",
                        })
                      }
                      type="button"
                      variant="outline"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Itinerary Item
                    </Button>
                  </CardContent>
                </Card>

                {/* Save Button for Itinerary Tab */}
                <div className="flex justify-end gap-3 border-t py-6">
                  <Button
                    disabled={isSubmitting || isImageUploading || isGalleryUploading}
                    onClick={saveItinerary}
                    type="button"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Itinerary"
                    )}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </form>
        </Form>
      </div>
    </PageContainer>
  );
};

export default OfferForm;
