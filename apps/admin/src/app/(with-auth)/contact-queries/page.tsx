import { Suspense } from "react";

import PageContainer from "@/components/layout/page-container";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import ContactQueriesListingPage from "@/features/contact-queries/components/contact-queries-listing";
import { searchParamsCache } from "@/lib/searchparams";

export const metadata = {
  title: "Dashboard: Contact Queries",
};

export default async function Page(props: PageProps<"/contact-queries">) {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <div className="flex items-start justify-between">
          <Heading description="View and manage contact form submissions" title="Contact Queries" />
        </div>
        <Separator />
        <Suspense
          fallback={
            <DataTableSkeleton columnCount={6} filterCount={2} rowCount={8} />
          }
        >
          <ContactQueriesListingPage />
        </Suspense>
      </div>
    </PageContainer>
  );
}
