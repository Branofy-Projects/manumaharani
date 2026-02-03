import { notFound } from "next/navigation";
import { Suspense } from "react";

import FormCardSkeleton from "@/components/form-card-skeleton";
import PageContainer from "@/components/layout/page-container";
import TestimonialForm from "@/features/testimonials/components/testimonial-form";
import { getTestimonialById } from "@repo/actions";

export const metadata = {
  title: "Dashboard: Edit Testimonial",
};

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function TestimonialEditPage(props: PageProps) {
  const params = await props.params;
  const testimonialId = parseInt(params.id, 10);

  if (isNaN(testimonialId)) {
    notFound();
  }

  const testimonial = await getTestimonialById(testimonialId);

  if (!testimonial) {
    notFound();
  }

  return (
    <PageContainer scrollable>
      <div className="flex-1 space-y-4">
        <Suspense fallback={<FormCardSkeleton />}>
          <TestimonialForm
            initialData={testimonial as any}
            pageTitle="Edit Testimonial"
            testimonialId={params.id}
          />
        </Suspense>
      </div>
    </PageContainer>
  );
}



