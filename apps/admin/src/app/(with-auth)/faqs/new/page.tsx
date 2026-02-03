import { Suspense } from "react";

import FormCardSkeleton from "@/components/form-card-skeleton";
import PageContainer from "@/components/layout/page-container";
import FaqForm from "@/features/master-data/components/faq-form";

export const metadata = {
  title: "Dashboard: Create FAQ",
};

export default function NewFaqPage() {
  return (
    <PageContainer scrollable>
      <div className="flex-1 space-y-4">
        <Suspense fallback={<FormCardSkeleton />}>
          <FaqForm initialData={null} pageTitle="Create New FAQ" />
        </Suspense>
      </div>
    </PageContainer>
  );
}



