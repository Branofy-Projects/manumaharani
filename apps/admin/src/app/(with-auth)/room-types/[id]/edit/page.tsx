import { getRoomTypeById } from "@repo/actions";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import FormCardSkeleton from "@/components/form-card-skeleton";
import PageContainer from "@/components/layout/page-container";
import { RoomTypeForm } from "@/features/room-types/components/room-type-form";

export const metadata = {
  title: "Dashboard: Edit Room Type",
};

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function RoomTypeEditPage(props: PageProps) {
  const params = await props.params;
  const roomTypeId = parseInt(params.id, 10);

  if (isNaN(roomTypeId)) {
    notFound();
  }

  const roomType = await getRoomTypeById(roomTypeId);

  if (!roomType) {
    notFound();
  }

  return (
    <PageContainer scrollable>
      <div className="flex-1 space-y-4">
        <Suspense fallback={<FormCardSkeleton />}>
          <RoomTypeForm
            initialData={roomType as any}
            pageTitle="Edit Room Type"
            roomTypeId={params.id}
          />
        </Suspense>
      </div>
    </PageContainer>
  );
}


