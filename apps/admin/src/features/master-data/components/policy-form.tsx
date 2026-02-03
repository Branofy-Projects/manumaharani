"use client";
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
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { createPolicy, updatePolicy } from '@repo/actions';
import type { TPolicy } from "@repo/db";
import { zodResolver } from '@/lib/zod-resolver';

const formSchema = z.object({
  label: z.string().min(1, "Label is required.").max(255),
  kind: z.enum(["include", "exclude"], {
    message: "Policy type is required.",
  }),
});

type TPolicyFormProps = {
  initialData: TPolicy | null;
  pageTitle: string;
  policyId?: string;
};

const PolicyForm = (props: TPolicyFormProps) => {
  const { initialData, pageTitle, policyId } = props;

  const router = useRouter();

  const defaultValues = useMemo(() => {
    return {
      label: initialData?.label || "",
      kind: (initialData?.kind as "include" | "exclude") || "include",
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

      if (policyId) {
        await updatePolicy(parseInt(policyId, 10), data);
        toast.success("Policy updated successfully!");
      } else {
        await createPolicy(data);
        toast.success("Policy created successfully!");
      }

      setTimeout(() => {
        try {
          router.push("/policies");
        } catch (redirectError) {
          console.error("Redirect error:", redirectError);
          if (typeof window !== "undefined") {
            window.location.href = "/policies";
          }
        }
      }, 100);
    } catch (error: any) {
      console.error("Error creating/updating policy - Full error object:", error);
      const errorMessage =
        error?.message || String(error) || "Failed to save policy";
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
                    <Input placeholder="Enter policy label" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="kind"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Policy Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select policy type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="include">Include</SelectItem>
                      <SelectItem value="exclude">Exclude</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto"
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {policyId ? "Update Policy" : "Create Policy"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/policies")}
                disabled={isSubmitting}
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

export default PolicyForm;



