import { notFound } from "next/navigation";
import { Suspense } from "react";

import FormCardSkeleton from "@/components/form-card-skeleton";
import PageContainer from "@/components/layout/page-container";
import FaqForm from "@/features/master-data/components/faq-form";
import { getFaqById } from "@repo/actions";

export const metadata = {
  title: "Dashboard: Edit FAQ",
};

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function FaqEditPage(props: PageProps) {
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
          <FaqForm
            initialData={faq as any}
            pageTitle="Edit FAQ"
            faqId={params.id}
          />
        </Suspense>
      </div>
    </PageContainer>
  );
}



