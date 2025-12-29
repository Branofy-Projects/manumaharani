import { notFound } from "next/navigation";
import { Suspense } from "react";

import FormCardSkeleton from "@/components/form-card-skeleton";
import PageContainer from "@/components/layout/page-container";
import GalleryForm from "@/features/gallery/components/gallery-form";
import { getGalleryById } from "@repo/actions";

export const metadata = {
  title: "Dashboard: Edit Gallery Item",
};

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function GalleryEditPage(props: PageProps) {
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
          <GalleryForm
            initialData={gallery as any}
            pageTitle="Edit Gallery Item"
            galleryId={params.id}
          />
        </Suspense>
      </div>
    </PageContainer>
  );
}

