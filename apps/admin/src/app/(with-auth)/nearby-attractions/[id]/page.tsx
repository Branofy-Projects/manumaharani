import { getAttractionById } from "@repo/actions";
import { notFound } from "next/navigation";

import AttractionForm from "@/features/master-data/components/attraction-form";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const attraction = await getAttractionById(params.id);

  if (!attraction) {
    return notFound();
  }

  return (
    <AttractionForm
      initialData={attraction}
      pageTitle="Edit Attraction"
      attractionId={params.id}
    />
  );
}
