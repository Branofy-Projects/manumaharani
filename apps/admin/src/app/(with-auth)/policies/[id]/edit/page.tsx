import { getPolicyById } from "@repo/actions/master-data.actions";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import FormCardSkeleton from "@/components/form-card-skeleton";
import PageContainer from "@/components/layout/page-container";
import PolicyForm from "@/features/master-data/components/policy-form";

export const metadata = {
  title: "Dashboard: Edit Policy",
};

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function PolicyEditPage(props: PageProps) {
  const params = await props.params;
  const policyId = parseInt(params.id, 10);

  if (isNaN(policyId)) {
    notFound();
  }

  const policy = await getPolicyById(policyId);

  if (!policy) {
    notFound();
  }

  return (
    <PageContainer scrollable>
      <div className="flex-1 space-y-4">
        <Suspense fallback={<FormCardSkeleton />}>
          <PolicyForm
            initialData={policy as any}
            pageTitle="Edit Policy"
            policyId={params.id}
          />
        </Suspense>
      </div>
    </PageContainer>
  );
}


