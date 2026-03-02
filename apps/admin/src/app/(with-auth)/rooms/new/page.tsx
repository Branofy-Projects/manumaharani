import { Suspense } from "react";

import FormCardSkeleton from "@/components/form-card-skeleton";
import { RoomForm } from "@/features/rooms/components/room-form";

export const metadata = {
  title: "Dashboard: Create Room",
};

export default function NewRoomPage() {
  return (
    <Suspense fallback={<FormCardSkeleton />}>
      <RoomForm initialData={null} pageTitle="Create New Room" />
    </Suspense>
  );
}
