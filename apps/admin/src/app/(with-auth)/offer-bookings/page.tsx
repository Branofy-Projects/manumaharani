import { Suspense } from "react";

import PageContainer from "@/components/layout/page-container";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import OfferBookingsListingPage from "@/features/offer-bookings/components/offer-bookings-listing";
import { searchParamsCache } from "@/lib/searchparams";

export const metadata = {
  title: "Dashboard: Offer Bookings",
};

export default async function Page(props: PageProps<"/offer-bookings">) {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <div className="flex items-start justify-between">
          <Heading description="View and manage offer booking requests" title="Offer Bookings" />
        </div>
        <Separator />
        <Suspense
          fallback={
            <DataTableSkeleton columnCount={7} filterCount={2} rowCount={8} />
          }
        >
          <OfferBookingsListingPage />
        </Suspense>
      </div>
    </PageContainer>
  );
}
