import { notFound } from "next/navigation";
import { Suspense } from "react";

import FormCardSkeleton from "@/components/form-card-skeleton";
import PageContainer from "@/components/layout/page-container";
import AmenityForm from "@/features/master-data/components/amenity-form";
import { getAmenityById } from "@repo/actions";

export const metadata = {
  title: "Dashboard: Edit Amenity",
};

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AmenityEditPage(props: PageProps) {
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
          <AmenityForm
            initialData={amenity as any}
            pageTitle="Edit Amenity"
            amenityId={params.id}
          />
        </Suspense>
      </div>
    </PageContainer>
  );
}


