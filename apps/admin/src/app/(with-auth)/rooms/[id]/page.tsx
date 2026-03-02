<<<<<<< Updated upstream
=======
import { getRoomById } from "@repo/actions";
>>>>>>> Stashed changes
import { notFound } from "next/navigation";
import { Suspense } from "react";

import FormCardSkeleton from "@/components/form-card-skeleton";
import PageContainer from "@/components/layout/page-container";
import RoomDetailsView from "@/features/rooms/components/room-details-view";
<<<<<<< Updated upstream
import { getRoomById } from "@repo/actions";
=======
>>>>>>> Stashed changes

export const metadata = {
  title: "Dashboard: Room Details",
};

type PageProps = {
  params: Promise<{ id: string }>;
};

<<<<<<< Updated upstream
export default async function RoomDetailsPage(props: PageProps) {
=======
export default async function RoomDetailPage(props: PageProps) {
>>>>>>> Stashed changes
  const params = await props.params;
  const roomId = parseInt(params.id, 10);

<<<<<<< Updated upstream
  if (isNaN(roomId)) {
    notFound();
  }

  const room = await getRoomById(roomId);

  if (!room) {
    notFound();
  }

=======
  if (!params.id) {
    notFound();
  }

  const id = parseInt(params.id, 10);
  if (Number.isNaN(id)) {
    notFound();
  }

  const room = await getRoomById(id);

  if (!room) {
    notFound();
  }

>>>>>>> Stashed changes
  return (
    <PageContainer scrollable>
      <div className="flex-1 space-y-4">
        <Suspense fallback={<FormCardSkeleton />}>
<<<<<<< Updated upstream
          <RoomDetailsView room={room as any} />
=======
          <RoomDetailsView room={room} />
>>>>>>> Stashed changes
        </Suspense>
      </div>
    </PageContainer>
  );
}
<<<<<<< Updated upstream



=======
>>>>>>> Stashed changes
