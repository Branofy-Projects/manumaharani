import { getRoomById } from "@repo/actions";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import FormCardSkeleton from "@/components/form-card-skeleton";
import PageContainer from "@/components/layout/page-container";
import RoomDetailsView from "@/features/rooms/components/room-details-view";

export const metadata = {
  title: "Dashboard: Room Details",
};

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function RoomDetailsPage(props: PageProps) {
  const params = await props.params;
  const roomId = parseInt(params.id, 10);

  if (isNaN(roomId)) {
    notFound();
  }

  const room = await getRoomById(roomId);

  if (!room) {
    notFound();
  }

  return (
    <PageContainer scrollable>
      <div className="flex-1 space-y-4">
        <Suspense fallback={<FormCardSkeleton />}>
          <RoomDetailsView room={room as any} />
        </Suspense>
      </div>
    </PageContainer>
  );
}



