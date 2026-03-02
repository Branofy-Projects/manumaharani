import { getEventByIdWithDetails } from "@repo/actions";
import { notFound } from "next/navigation";

import EventForm from "@/features/events/components/event-form";

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  const event = await getEventByIdWithDetails(eventId);

  if (!event) {
    notFound();
  }

  return (
    <EventForm
      eventId={eventId}
      initialData={event}
      pageTitle={`Edit Event: ${event.name}`}
    />
  );
}
