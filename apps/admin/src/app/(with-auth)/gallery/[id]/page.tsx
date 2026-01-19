import { notFound } from "next/navigation";
import { Suspense } from "react";

import FormCardSkeleton from "@/components/form-card-skeleton";
import PageContainer from "@/components/layout/page-container";
import GalleryDetailsView from "@/features/gallery/components/gallery-details-view";
import { getGalleryById } from "@repo/actions";

export const metadata = {
  title: "Dashboard: Gallery Details",
};

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function GalleryDetailsPage(props: PageProps) {
  const params = await props.params;
  const galleryId = parseInt(params.id, 10);

  if (isNaN(galleryId)) {
    notFound();
  }

  const gallery = await getGalleryById(galleryId);

  if (!gallery) {
    notFound();
  }

  return (
    <PageContainer scrollable>
      <div className="flex-1 space-y-4">
        <Suspense fallback={<FormCardSkeleton />}>
          <GalleryDetailsView gallery={gallery as any} />
        </Suspense>
      </div>
    </PageContainer>
  );
}


