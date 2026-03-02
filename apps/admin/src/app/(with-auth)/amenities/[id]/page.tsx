import { getAmenityById } from "@repo/actions/master-data.actions";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import FormCardSkeleton from "@/components/form-card-skeleton";
import PageContainer from "@/components/layout/page-container";
import AmenityDetailsView from "@/features/master-data/components/amenity-details-view";

export const metadata = {
  title: "Dashboard: Amenity Details",
};

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AmenityDetailsPage(props: PageProps) {
  const params = await props.params;
  const amenityId = parseInt(params.id, 10);

  if (isNaN(amenityId)) {
    notFound();
  }

  const amenity = await getAmenityById(amenityId);

  if (!amenity) {
    notFound();
  }

  return (
    <PageContainer scrollable>
      <div className="flex-1 space-y-4">
        <Suspense fallback={<FormCardSkeleton />}>
          <AmenityDetailsView amenity={amenity as any} />
        </Suspense>
      </div>
    </PageContainer>
  );
}



