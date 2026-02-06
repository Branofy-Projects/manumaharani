"use client";
import { createFaq, updateFaq } from '@repo/actions/master-data.actions';
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

import type { TFaq } from "@repo/db";

const formSchema = z.object({
  answer: z.string().min(1, "Answer is required."),
  question: z.string().min(1, "Question is required.").max(500),
});

type TFaqFormProps = {
  faqId?: string;
  initialData: null | TFaq;
  pageTitle: string;
};

const FaqForm = (props: TFaqFormProps) => {
  const { faqId, initialData, pageTitle } = props;

  const router = useRouter();

  const defaultValues = useMemo(() => {
    return {
      answer: initialData?.answer || "",
      question: initialData?.question || "",
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
                      className="min-h-[150px]"
                      placeholder="Enter answer"
                      {...field}
                    />
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
                {faqId ? "Update FAQ" : "Create FAQ"}
              </Button>
              <Button
                className="w-full sm:w-auto"
                disabled={isSubmitting}
                onClick={() => router.push("/faqs")}
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

export default FaqForm;


