import { getAttractionBookings } from "@repo/actions";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth-utils";
import { searchParamsCache } from "@/lib/searchparams";

import { AttractionBookingsTable } from "./attraction-bookings-table";
import { columns } from "./attraction-bookings-table/columns";

type TGetAttractionBookingsFilters = {
  limit?: number;
  page?: number;
  search?: string;
  status?: string;
};

export default async function AttractionBookingsListingPage() {
  const page = searchParamsCache.get("page");
  const search = searchParamsCache.get("q");
  const pageLimit = searchParamsCache.get("perPage");
  const status = searchParamsCache.get("status");

  const filters: TGetAttractionBookingsFilters = {
    limit: pageLimit,
    page,
    ...(search && { search }),
    ...(status && { status }),
  };

  const user = await getCurrentUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const { attractionBookings, total } = await getAttractionBookings(filters);

  return <AttractionBookingsTable columns={columns} data={attractionBookings} totalItems={total} />;
}
