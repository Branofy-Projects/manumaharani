import { getOfferBookings } from "@repo/actions";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth-utils";
import { searchParamsCache } from "@/lib/searchparams";

import { OfferBookingsTable } from "./offer-bookings-table";
import { columns } from "./offer-bookings-table/columns";

type TGetOfferBookingsFilters = {
  limit?: number;
  page?: number;
  search?: string;
  status?: string;
};

export default async function OfferBookingsListingPage() {
  const page = searchParamsCache.get("page");
  const search = searchParamsCache.get("q");
  const pageLimit = searchParamsCache.get("perPage");
  const status = searchParamsCache.get("status");

  const filters: TGetOfferBookingsFilters = {
    limit: pageLimit,
    page,
    ...(search && { search }),
    ...(status && { status }),
  };

  const user = await getCurrentUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const { offerBookings, total } = await getOfferBookings(filters);

  return <OfferBookingsTable columns={columns} data={offerBookings} totalItems={total} />;
}
