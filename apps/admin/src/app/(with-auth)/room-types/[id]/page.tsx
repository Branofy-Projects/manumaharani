import { getRoomTypeById } from "@repo/actions";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import FormCardSkeleton from "@/components/form-card-skeleton";
import PageContainer from "@/components/layout/page-container";
import RoomTypeDetailsView from "@/features/room-types/components/room-type-details-view";

export const metadata = {
  title: "Dashboard: Room Type Details",
};

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function RoomTypeDetailsPage(props: PageProps) {
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
          <RoomTypeDetailsView roomType={roomType as any} />
        </Suspense>
      </div>
    </PageContainer>
  );
}


