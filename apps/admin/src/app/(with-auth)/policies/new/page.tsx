import { Suspense } from "react";

import FormCardSkeleton from "@/components/form-card-skeleton";
import PageContainer from "@/components/layout/page-container";
import PolicyForm from "@/features/master-data/components/policy-form";

export const metadata = {
  title: "Dashboard: Create Policy",
};

export default function NewPolicyPage() {
  return (
    <PageContainer scrollable>
      <div className="flex-1 space-y-4">
        <Suspense fallback={<FormCardSkeleton />}>
          <PolicyForm initialData={null} pageTitle="Create New Policy" />
        </Suspense>
      </div>
    </PageContainer>
  );
}

