import { getOfferById } from "@repo/actions";
import { notFound } from "next/navigation";

import OfferForm from "@/features/offers/components/offer-form";

export default async function EditOfferPage({
  params,
}: {
  params: Promise<{ offerId: string }>;
}) {
  const { offerId } = await params;
  const offer = await getOfferById(offerId);

  if (!offer) {
    notFound();
  }

  return (
    <OfferForm
      initialData={offer}
      offerId={offerId}
      pageTitle={`Edit Offer: ${offer.name}`}
    />
  );
}
