import { notFound } from "next/navigation";
import { Suspense } from "react";

import FormCardSkeleton from "@/components/form-card-skeleton";
import PageContainer from "@/components/layout/page-container";
import PolicyDetailsView from "@/features/master-data/components/policy-details-view";
import { getPolicyById } from "@repo/actions";

export const metadata = {
  title: "Dashboard: Policy Details",
};

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function PolicyDetailsPage(props: PageProps) {
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
          <PolicyDetailsView policy={policy as any} />
        </Suspense>
      </div>
    </PageContainer>
  );
}

