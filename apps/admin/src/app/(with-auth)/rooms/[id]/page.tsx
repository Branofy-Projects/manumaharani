import { getUserById } from "@repo/actions";
import { AppResponseHandler } from "@repo/actions/utils/app-response-handler";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import FormCardSkeleton from "@/components/form-card-skeleton";
import PageContainer from "@/components/layout/page-container";
import UserDetailsView from "@/features/users/components/user-details-view";

export const metadata = {
  title: "Dashboard: User Details",
};

type PageProps = {
  params: Promise<{ userId: string }>;
};

export default async function UserDetailPage(props: PageProps) {
  const params = await props.params;

  if (!params.userId || params.userId === "new") {
    notFound();
  }

  const result = await getUserById(params.userId);

  if (AppResponseHandler.isError(result)) {
    notFound();
  }

  const user = result;

  return (
    <PageContainer scrollable>
      <div className="flex-1 space-y-4">
        <Suspense fallback={<FormCardSkeleton />}>
          <UserDetailsView user={user} />
        </Suspense>
      </div>
    </PageContainer>
  );
}