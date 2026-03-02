import { Suspense } from "react";

import PageContainer from "@/components/layout/page-container";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import { AddRecipientButton } from "@/features/notification-recipients/components/add-recipient-button";
import NotificationRecipientsListingPage from "@/features/notification-recipients/components/notification-recipients-listing";
import { searchParamsCache } from "@/lib/searchparams";

export const metadata = {
  title: "Dashboard: Notification Recipients",
};

export default async function Page(props: PageProps<"/notification-recipients">) {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            description="Manage email recipients for booking notifications"
            title="Notification Recipients"
          />
          <AddRecipientButton />
        </div>
        <Separator />
        <Suspense
          fallback={
            <DataTableSkeleton columnCount={6} filterCount={1} rowCount={8} />
          }
        >
          <NotificationRecipientsListingPage />
        </Suspense>
      </div>
    </PageContainer>
  );
}
