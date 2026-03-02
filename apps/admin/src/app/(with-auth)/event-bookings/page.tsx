import { Suspense } from "react";

import PageContainer from "@/components/layout/page-container";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import EventBookingsListingPage from "@/features/event-bookings/components/event-bookings-listing";
import { searchParamsCache } from "@/lib/searchparams";

export const metadata = {
  title: "Dashboard: Event Bookings",
};

export default async function Page(props: PageProps<"/event-bookings">) {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <div className="flex items-start justify-between">
          <Heading description="View and manage event booking requests" title="Event Bookings" />
        </div>
        <Separator />
        <Suspense
          fallback={
            <DataTableSkeleton columnCount={6} filterCount={2} rowCount={8} />
          }
        >
          <EventBookingsListingPage />
        </Suspense>
      </div>
    </PageContainer>
  );
}
