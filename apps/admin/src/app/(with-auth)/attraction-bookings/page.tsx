import { Suspense } from "react";

import PageContainer from "@/components/layout/page-container";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import AttractionBookingsListingPage from "@/features/attraction-bookings/components/attraction-bookings-listing";
import { searchParamsCache } from "@/lib/searchparams";

export const metadata = {
  title: "Dashboard: Attraction Bookings",
};

export default async function Page(props: PageProps<"/attraction-bookings">) {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <div className="flex items-start justify-between">
          <Heading description="View and manage attraction booking requests" title="Attraction Bookings" />
        </div>
        <Separator />
        <Suspense
          fallback={
            <DataTableSkeleton columnCount={7} filterCount={2} rowCount={8} />
          }
        >
          <AttractionBookingsListingPage />
        </Suspense>
      </div>
    </PageContainer>
  );
}
