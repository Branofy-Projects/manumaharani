import { Suspense } from "react";

import PageContainer from "@/components/layout/page-container";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import RoomBookingsListingPage from "@/features/room-bookings/components/room-bookings-listing";
import { searchParamsCache } from "@/lib/searchparams";

export const metadata = {
  title: "Dashboard: Room Bookings",
};

export default async function Page(props: PageProps<"/room-bookings">) {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <div className="flex items-start justify-between">
          <Heading description="View and manage room booking requests" title="Room Bookings" />
        </div>
        <Separator />
        <Suspense
          fallback={
            <DataTableSkeleton columnCount={8} filterCount={2} rowCount={8} />
          }
        >
          <RoomBookingsListingPage />
        </Suspense>
      </div>
    </PageContainer>
  );
}
