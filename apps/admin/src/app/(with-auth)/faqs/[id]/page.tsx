import { notFound } from "next/navigation";
import { Suspense } from "react";

import FormCardSkeleton from "@/components/form-card-skeleton";
import PageContainer from "@/components/layout/page-container";
import FaqDetailsView from "@/features/master-data/components/faq-details-view";
import { getFaqById } from "@repo/actions";

export const metadata = {
  title: "Dashboard: FAQ Details",
};

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function FaqDetailsPage(props: PageProps) {
  const params = await props.params;
  const faqId = parseInt(params.id, 10);

  if (isNaN(faqId)) {
    notFound();
  }

  const faq = await getFaqById(faqId);

  if (!faq) {
    notFound();
  }

  return (
    <PageContainer scrollable>
      <div className="flex-1 space-y-4">
        <Suspense fallback={<FormCardSkeleton />}>
          <FaqDetailsView faq={faq as any} />
        </Suspense>
      </div>
    </PageContainer>
  );
}



