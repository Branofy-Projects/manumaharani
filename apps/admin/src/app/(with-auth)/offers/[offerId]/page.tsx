import { getOfferByIdWithDetails } from "@repo/actions/offers.actions";
import { notFound } from "next/navigation";

import OfferForm from "@/features/offers/components/offer-form";

export default async function EditOfferPage({
  params,
}: {
  params: Promise<{ offerId: string }>;
}) {
  const { offerId } = await params;
  const offer = await getOfferByIdWithDetails(offerId);

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
