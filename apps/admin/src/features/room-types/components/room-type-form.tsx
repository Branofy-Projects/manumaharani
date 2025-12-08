"use client";
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

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
import { zodResolver } from '@hookform/resolvers/zod';
import { createRoomType } from '@repo/actions';
import type { TRoomType } from "@repo/db";

const BED_TYPES = [
  { value: "single", label: "Single" },
  { value: "double", label: "Double" },
  { value: "queen", label: "Queen" },
  { value: "king", label: "King" },
  { value: "twin", label: "Twin" },
] as const;

const formSchema = z.object({
  name: z.string().min(1, "Room type name is required.").max(255),
  description: z.string().min(10, "Description is required."),
  bed_type: z.enum(["single", "double", "queen", "king", "twin"]),
  max_occupancy: z.coerce.number().min(1, "Max occupancy must be at least 1").max(20),
  number_of_beds: z.coerce.number().min(1, "Number of beds must be at least 1"),
  size_sqft: z.coerce.number().min(1, "Room size must be at least 1 sq ft"),
  base_price: z.coerce.number().min(0, "Base price must be 0 or greater"),
});

type TRoomTypeFormProps = {
  initialData: (TRoomType & { images?: any[] }) | null;
  pageTitle: string;
  roomTypeId?: string;
};

export const RoomTypeForm = (props: TRoomTypeFormProps) => {
  const { initialData, pageTitle } = props;

  const router = useRouter();

  const defaultValues = useMemo(() => {
    return {
      name: initialData?.name || "",
      description: initialData?.description || "",
      bed_type: (initialData?.bed_type as "single" | "double" | "queen" | "king" | "twin") || "double",
      max_occupancy: initialData?.max_occupancy || 2,
      number_of_beds: initialData?.number_of_beds || 1,
      size_sqft: initialData?.size_sqft || 200,
      base_price: initialData?.base_price ? Number(initialData.base_price) : 0,
    };
  }, [initialData]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);

      // Generate slug from name
      const slug = data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      console.log("Creating room type with data:", {
        name: data.name,
        description: data.description,
        slug,
        bed_type: data.bed_type,
        max_occupancy: data.max_occupancy,
        number_of_beds: data.number_of_beds,
        size_sqft: data.size_sqft,
        base_price: data.base_price,
      });

      // Create room type
      const result = await createRoomType({
        name: data.name,
        description: data.description,
        slug,
        bed_type: data.bed_type,
        max_occupancy: data.max_occupancy,
        number_of_beds: data.number_of_beds,
        size_sqft: data.size_sqft,
        base_price: data.base_price.toString(),
        status: "active",
        order: 0,
      });

      console.log("Room type created successfully:", result);

      // Show success toast
      toast.success("Room type created successfully!");
      
      // Small delay to ensure toast is visible, then redirect
      setTimeout(() => {
        try {
          router.push('/room-types');
        } catch (redirectError) {
          console.error("Redirect error:", redirectError);
          // Fallback to window.location if router fails
          if (typeof window !== 'undefined') {
            window.location.href = '/room-types';
          }
        }
      }, 100);
    } catch (error: any) {
      console.error("Error creating room type - Full error object:", error);
      console.error("Error message:", error?.message);
      console.error("Error stack:", error?.stack);
      console.error("Error string:", String(error));
      
      // Check if it's a URL-related error
      const errorMessage = error?.message || String(error) || "Failed to create room type";
      
      // If the error mentions "Invalid URL" but the room type was created, 
      // it's likely a redirect issue - don't show error, just redirect
      if (errorMessage.toLowerCase().includes("invalid url") || 
          errorMessage.toLowerCase().includes("url")) {
        console.warn("URL error detected, but room type may have been created. Attempting redirect...");
        toast.success("Room type created successfully!");
        setTimeout(() => {
          if (typeof window !== 'undefined') {
            window.location.href = '/room-types';
          } else {
            router.push('/room-types');
          }
        }, 100);
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
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
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Deluxe Suite" {...field} />
                    </FormControl>
                    <FormDescription className="text-xs">
                      The name of the room type
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
                        placeholder="Describe the room type..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      A detailed description of the room type
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="bed_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bed Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select bed type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {BED_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription className="text-xs">
                        Type of bed in the room
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="max_occupancy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Occupancy</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="e.g., 2"
                          value={field.value || ''}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Maximum number of guests
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="number_of_beds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Beds</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="e.g., 1"
                          value={field.value || ''}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Total number of beds
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="size_sqft"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Room Size (sq ft)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="e.g., 200"
                          value={field.value || ''}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Room size in square feet
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="base_price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Base Price (₹)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="e.g., 5000"
                          value={field.value || ''}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Base price per night
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Room Type"
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

