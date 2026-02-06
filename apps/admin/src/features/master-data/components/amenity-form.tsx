"use client";
import { createAmenity, updateAmenity } from '@repo/actions/master-data.actions';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@/lib/zod-resolver';

import type { TAmenity } from "@repo/db";

const formSchema = z.object({
  icon: z.string().min(1, "Icon is required.").max(255),
  label: z.string().min(1, "Label is required.").max(255),
});

type TAmenityFormProps = {
  amenityId?: string;
  initialData: null | TAmenity;
  pageTitle: string;
};

const AmenityForm = (props: TAmenityFormProps) => {
  const { amenityId, initialData, pageTitle } = props;

  const router = useRouter();

  const defaultValues = useMemo(() => {
    return {
      icon: initialData?.icon || "",
      label: initialData?.label || "",
    };
  }, [initialData]);

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues,
    resolver: zodResolver(formSchema),
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);

      if (amenityId) {
        await updateAmenity(parseInt(amenityId, 10), data);
        toast.success("Amenity updated successfully!");
      } else {
        await createAmenity(data);
        toast.success("Amenity created successfully!");
      }

      setTimeout(() => {
        try {
          router.push("/amenities");
        } catch (redirectError) {
          console.error("Redirect error:", redirectError);
          if (typeof window !== "undefined") {
            window.location.href = "/amenities";
          }
        }
      }, 100);
    } catch (error: any) {
      console.error("Error creating/updating amenity - Full error object:", error);
      const errorMessage =
        error?.message || String(error) || "Failed to save amenity";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
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
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter amenity label" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter icon name or class" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-4">
              <Button
                className="w-full sm:w-auto"
                disabled={isSubmitting}
                type="submit"
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {amenityId ? "Update Amenity" : "Create Amenity"}
              </Button>
              <Button
                className="w-full sm:w-auto"
                disabled={isSubmitting}
                onClick={() => router.push("/amenities")}
                type="button"
                variant="outline"
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

export default AmenityForm;


