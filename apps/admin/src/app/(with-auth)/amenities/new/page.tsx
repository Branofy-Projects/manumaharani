import { Suspense } from "react";

import FormCardSkeleton from "@/components/form-card-skeleton";
import PageContainer from "@/components/layout/page-container";
import AmenityForm from "@/features/master-data/components/amenity-form";

export const metadata = {
  title: "Dashboard: Create Amenity",
};

export default function NewAmenityPage() {
  return (
    <PageContainer scrollable>
      <div className="flex-1 space-y-4">
        <Suspense fallback={<FormCardSkeleton />}>
          <AmenityForm initialData={null} pageTitle="Create New Amenity" />
        </Suspense>
      </div>
    </PageContainer>
  );
}


