import { getTestimonialById } from "@repo/actions";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import FormCardSkeleton from "@/components/form-card-skeleton";
import PageContainer from "@/components/layout/page-container";
import TestimonialDetailsView from "@/features/testimonials/components/testimonial-details-view";

export const metadata = {
  title: "Dashboard: Testimonial Details",
};

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function TestimonialDetailsPage(props: PageProps) {
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
          <TestimonialDetailsView testimonial={testimonial as any} />
        </Suspense>
      </div>
    </PageContainer>
  );
}


