import { notFound } from "next/navigation";
import { Suspense } from "react";

import FormCardSkeleton from "@/components/form-card-skeleton";
import PageContainer from "@/components/layout/page-container";
import { RoomForm } from "@/features/rooms/components/room-form";
import { getRoomById } from "@repo/actions";

export const metadata = {
  title: "Dashboard: Edit Room",
};

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function RoomEditPage(props: PageProps) {
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

