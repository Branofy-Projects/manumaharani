import { getRoomById } from "@repo/actions";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import FormCardSkeleton from "@/components/form-card-skeleton";
import PageContainer from "@/components/layout/page-container";
import RoomDetailsView from "@/features/rooms/components/room-details-view";

export const metadata = {
  title: "Dashboard: User Details",
};


export default async function RoomDetailPage(props: PageProps<"/rooms/[id]">) {
  const params = await props.params;

  if (!params.id) {
    notFound();
  }

  const id = parseInt(params.id, 10);
  if (Number.isNaN(id)) {
    notFound();
  }

  const room = await getRoomById(id);

  return (
    <PageContainer scrollable>
      <div className="flex-1 space-y-4">
        <Suspense fallback={<FormCardSkeleton />}>
          <RoomDetailsView room={room} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
