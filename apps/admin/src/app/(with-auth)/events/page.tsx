import { IconPlus } from "@tabler/icons-react";
import Link from "next/link";
import { Suspense } from "react";

import PageContainer from "@/components/layout/page-container";
import { buttonVariants } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import EventsListingPage from "@/features/events/components/events-listing";
import { searchParamsCache } from "@/lib/searchparams";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Dashboard: Events",
};

export default async function Page(props: PageProps<"/events">) {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <div className="flex items-start justify-between">
          <Heading description="Manage events" title="Events" />
          <Link
            className={cn(buttonVariants(), "text-xs md:text-sm")}
            href="/events/new"
          >
            <IconPlus className="mr-2 h-4 w-4" /> Add New
          </Link>
        </div>
        <Separator />
        <Suspense
          fallback={
            <DataTableSkeleton columnCount={3} filterCount={1} rowCount={8} />
          }
        >
          <EventsListingPage />
        </Suspense>
      </div>
    </PageContainer>
  );
}
