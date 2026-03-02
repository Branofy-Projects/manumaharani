<<<<<<< Updated upstream
=======
import { getRoomById } from "@repo/actions";
>>>>>>> Stashed changes
import { notFound } from "next/navigation";
import { Suspense } from "react";

import FormCardSkeleton from "@/components/form-card-skeleton";
<<<<<<< Updated upstream
import PageContainer from "@/components/layout/page-container";
import { RoomForm } from "@/features/rooms/components/room-form";
import { getRoomById } from "@repo/actions";
=======
import { RoomForm } from "@/features/rooms/components/room-form";
>>>>>>> Stashed changes

export const metadata = {
  title: "Dashboard: Edit Room",
};

type PageProps = {
  params: Promise<{ id: string }>;
};

<<<<<<< Updated upstream
export default async function RoomEditPage(props: PageProps) {
=======
export default async function EditRoomPage(props: PageProps) {
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

  return (
    <PageContainer scrollable>
      <div className="flex-1 space-y-4">
        <Suspense fallback={<FormCardSkeleton />}>
          <RoomForm
            initialData={room as any}
            pageTitle="Edit Room"
            roomId={params.id}
          />
        </Suspense>
      </div>
    </PageContainer>
  );
}



=======
  if (!params.id || params.id === "new") {
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

  return (
    <Suspense fallback={<FormCardSkeleton />}>
      <RoomForm
        initialData={room}
        pageTitle={`Edit Room${room.room_number ? `: ${room.room_number}` : ""}`}
        roomId={params.id}
      />
    </Suspense>
  );
}
>>>>>>> Stashed changes
