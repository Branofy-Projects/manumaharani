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
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@/lib/zod-resolver';
import { createFaq, updateFaq } from '@repo/actions';
import type { TFaq } from "@repo/db";

const formSchema = z.object({
  question: z.string().min(1, "Question is required.").max(500),
  answer: z.string().min(1, "Answer is required."),
});

type TFaqFormProps = {
  initialData: TFaq | null;
  pageTitle: string;
  faqId?: string;
};

const FaqForm = (props: TFaqFormProps) => {
  const { initialData, pageTitle, faqId } = props;

  const router = useRouter();

  const defaultValues = useMemo(() => {
    return {
      question: initialData?.question || "",
      answer: initialData?.answer || "",
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

      if (faqId) {
        await updateFaq(parseInt(faqId, 10), data);
        toast.success("FAQ updated successfully!");
      } else {
        await createFaq(data);
        toast.success("FAQ created successfully!");
      }

      setTimeout(() => {
        try {
          router.push("/faqs");
        } catch (redirectError) {
          console.error("Redirect error:", redirectError);
          if (typeof window !== "undefined") {
            window.location.href = "/faqs";
          }
        }
      }, 100);
    } catch (error: any) {
      console.error("Error creating/updating FAQ - Full error object:", error);
      const errorMessage =
        error?.message || String(error) || "Failed to save FAQ";
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
              name="question"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter question" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="answer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Answer</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter answer"
                      className="min-h-[150px]"
                      {...field}
                    />
                  </FormControl>
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
                {faqId ? "Update FAQ" : "Create FAQ"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/faqs")}
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

export default FaqForm;



