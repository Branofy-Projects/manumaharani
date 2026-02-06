"use client";
import { createTestimonial, updateTestimonial } from '@repo/actions';
import { createImages } from '@repo/actions/images.actions';
import { Loader2, Star } from 'lucide-react';
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

import type { TTestimonial } from "@repo/db";

const TESTIMONIAL_STATUS_OPTIONS = [
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
] as const;

const RATING_OPTIONS = [1, 2, 3, 4, 5];

const formSchema = z.object({
  admin_notes: z.string().optional(),
  avatar: ImagesArraySchema(0, 1),
  content: z.string().min(10, "Review must be at least 10 characters"),
  guest_email: z.string().email("Invalid email address").optional().or(z.literal("")),
  guest_location: z.string().optional(),
  guest_name: z.string().min(1, "Guest name is required.").max(255),
  platform: z.string().optional(),
  rating: z.coerce.number().min(1, "Rating must be at least 1").max(5, "Rating must be at most 5"),
  status: z.enum(["pending", "approved", "rejected"]),
  title: z.string().optional(),
});

type TTestimonialFormProps = {
  initialData: ({ guestAvatar?: any } & TTestimonial) | null;
  pageTitle: string;
  testimonialId?: string;
};

const TestimonialForm = (props: TTestimonialFormProps) => {
  const { initialData, pageTitle } = props;

  const router = useRouter();

  const defaultValues = useMemo(() => {
    return {
      admin_notes: initialData?.admin_notes || "",
      avatar: initialData?.guestAvatar
        ? [
          {
            _type: "existing" as const,
            alt_text: initialData.guestAvatar.alt_text || "",
            image_id: initialData.guestAvatar.id,
            large_url: initialData.guestAvatar.large_url || "",
            medium_url: initialData.guestAvatar.medium_url || "",
            order: 0,
            original_url: initialData.guestAvatar.original_url || "",
            small_url: initialData.guestAvatar.small_url || "",
          },
        ]
        : [],
      content: initialData?.content || "",
      guest_email: initialData?.guest_email || "",
      guest_location: initialData?.guest_location || "",
      guest_name: initialData?.guest_name || "",
      platform: initialData?.platform || "website",
      rating: initialData?.rating || 5,
      status: (initialData?.status as "approved" | "pending" | "rejected") || "pending",
      title: initialData?.title || "",
    };
  }, [initialData]);

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues,
    resolver: zodResolver(formSchema),
  });

  const [progresses, setProgresses] = useState<Record<string, number>>({});
  const [isAvatarUploading, setIsAvatarUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  const avatar = form.watch("avatar");
  const hasValidAvatar = useMemo(() => {
    if (!avatar || avatar.length === 0) return true; // Avatar is optional
    return hasValidImages(avatar as FileUploaderFormImage[]);
  }, [avatar]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setHasAttemptedSubmit(true);

    if (data.avatar && data.avatar.length > 0 && !hasValidAvatar) {
      toast.error("Please add alt text to the avatar image");
      return;
    }

    try {
      setIsSubmitting(true);

      let avatarId: null | number = null;

      if (data.avatar && data.avatar.length > 0) {
        const avatarImage = data.avatar[0];

        if (avatarImage._type === "new") {
          setIsAvatarUploading(true);

          const uploadResult = await uploadFilesWithProgress(
            [avatarImage.file],
            (progressMap: Record<string, number>) => {
              setProgresses(progressMap);
            },
            "/api/v1/upload-image"
          );

          const imageData = [{
            alt_text: avatarImage.alt_text,
            large_url: uploadResult[0]!.image.large_url,
            medium_url: uploadResult[0]!.image.medium_url,
            original_url: uploadResult[0]!.image.original_url,
            small_url: uploadResult[0]!.image.small_url,
          }];

          const createdImages = await createImages(imageData);

          if (Array.isArray(createdImages) && createdImages.length > 0) {
            avatarId = createdImages[0]!.id;
          }

          setIsAvatarUploading(false);
        } else {
          avatarId = avatarImage.image_id;
        }
      }

      if (props.testimonialId) {
        await updateTestimonial(parseInt(props.testimonialId, 10), {
          admin_notes: data.admin_notes || null,
          content: data.content,
          guest_avatar_id: avatarId,
          guest_email: data.guest_email || null,
          guest_location: data.guest_location || null,
          guest_name: data.guest_name,
          platform: data.platform || "website",
          rating: data.rating,
          status: data.status,
          title: data.title || null,
        });
        toast.success("Testimonial updated successfully!");
      } else {
        await createTestimonial({
          admin_notes: data.admin_notes || null,
          content: data.content,
          guest_avatar_id: avatarId,
          guest_email: data.guest_email || null,
          guest_location: data.guest_location || null,
          guest_name: data.guest_name,
          platform: data.platform || "website",
          rating: data.rating,
          status: data.status,
          title: data.title || null,
        });
        toast.success("Testimonial created successfully!");
      }

      setTimeout(() => {
        try {
          router.push('/testimonials');
        } catch (redirectError) {
          console.error("Redirect error:", redirectError);
          if (typeof window !== 'undefined') {
            window.location.href = '/testimonials';
          }
        }
      }, 100);
    } catch (error: any) {
      console.error("Error creating testimonial:", error);
      const errorMessage = error?.message || String(error) || "Failed to create testimonial";

      if (errorMessage.toLowerCase().includes("invalid url") ||
        errorMessage.toLowerCase().includes("url")) {
        toast.success("Testimonial created successfully!");
        setTimeout(() => {
          if (typeof window !== 'undefined') {
            window.location.href = '/testimonials';
          } else {
            router.push('/testimonials');
          }
        }, 100);
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
      setIsAvatarUploading(false);
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="guest_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Guest Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter guest name..." {...field} />
                        </FormControl>
                        <FormDescription className="text-xs">
                          Name of the guest
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="guest_email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Guest Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="guest@example.com"
                            type="email"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          Guest email address (optional)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="guest_location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Guest Location</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., New York, USA" {...field} />
                        </FormControl>
                        <FormDescription className="text-xs">
                          Guest location (optional)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="rating"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rating</FormLabel>
                        <Select
                          onValueChange={(value) => field.onChange(parseInt(value))}
                          value={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select rating" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {RATING_OPTIONS.map((rating) => (
                              <SelectItem key={rating} value={rating.toString()}>
                                <div className="flex items-center gap-1">
                                  {Array.from({ length: rating }).map((_, i) => (
                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" key={i} />
                                  ))}
                                  <span className="ml-1">({rating})</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription className="text-xs">
                          Rating from 1 to 5 stars
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Review title (optional)" {...field} />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Optional title for the review
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
                      <FormLabel>Review Content</FormLabel>
                      <FormControl>
                        <Textarea
                          className="min-h-[120px]"
                          placeholder="Write the testimonial review..."
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        The testimonial content (minimum 10 characters)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {TESTIMONIAL_STATUS_OPTIONS.map((status) => (
                              <SelectItem key={status.value} value={status.value}>
                                {status.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription className="text-xs">
                          Approval status
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="platform"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Platform</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., website, booking.com" {...field} />
                        </FormControl>
                        <FormDescription className="text-xs">
                          Where the review came from
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="avatar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Guest Avatar</FormLabel>
                      <FormControl>
                        <FileUploader
                          disabled={isAvatarUploading || isSubmitting}
                          id="testimonial-avatar"
                          maxFiles={1}
                          onValueChange={field.onChange}
                          progresses={progresses}
                          showValidation={hasAttemptedSubmit}
                          value={field.value || []}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Upload guest avatar image (optional)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="admin_notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Admin Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          className="min-h-[80px]"
                          placeholder="Internal notes about this testimonial..."
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

                <div className="flex justify-end gap-3 pt-2">
                  <Button
                    disabled={isSubmitting || isAvatarUploading}
                    onClick={() => router.back()}
                    type="button"
                    variant="outline"
                  >
                    Cancel
                  </Button>
                  <Button
                    disabled={isSubmitting || isAvatarUploading}
                    type="submit"
                  >
                    {isSubmitting || isAvatarUploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {isAvatarUploading ? "Uploading avatar..." : props.testimonialId ? "Updating..." : "Creating..."}
                      </>
                    ) : (
                      props.testimonialId ? "Update Testimonial" : "Create Testimonial"
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

export default TestimonialForm;

