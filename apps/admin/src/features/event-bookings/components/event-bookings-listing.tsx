import { getEventBookings } from "@repo/actions";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth-utils";
import { searchParamsCache } from "@/lib/searchparams";

import { EventBookingsTable } from "./event-bookings-table";
import { columns } from "./event-bookings-table/columns";

type TGetEventBookingsFilters = {
  limit?: number;
  page?: number;
  search?: string;
  status?: string;
};

export default async function EventBookingsListingPage() {
  const page = searchParamsCache.get("page");
  const search = searchParamsCache.get("q");
  const pageLimit = searchParamsCache.get("perPage");
  const status = searchParamsCache.get("status");

  const filters: TGetEventBookingsFilters = {
    limit: pageLimit,
    page,
    ...(search && { search }),
    ...(status && { status }),
  };

  const user = await getCurrentUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const { eventBookings, total } = await getEventBookings(filters);

  return <EventBookingsTable columns={columns} data={eventBookings} totalItems={total} />;
}
