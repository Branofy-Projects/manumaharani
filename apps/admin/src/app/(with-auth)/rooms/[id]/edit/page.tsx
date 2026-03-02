import { getRoomById } from "@repo/actions";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import FormCardSkeleton from "@/components/form-card-skeleton";
import { RoomForm } from "@/features/rooms/components/room-form";

export const metadata = {
  title: "Dashboard: Edit Room",
};

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditRoomPage(props: PageProps) {
  const params = await props.params;

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
