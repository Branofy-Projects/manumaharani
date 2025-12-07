import { getBookings } from "@repo/actions";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth-utils";
import { searchParamsCache } from "@/lib/searchparams";

import { BookingsTable } from "./bookings-tables";
import { columns } from "./bookings-tables/columns";

type TGetBookingsFilters = {
  search?: string;
  page?: number;
  limit?: number;
  status?: string;
  payment_status?: string;
};

export default async function BookingsListingPage() {
  const page = searchParamsCache.get("page");
  const search = searchParamsCache.get("q");
  const pageLimit = searchParamsCache.get("perPage");
  const status = searchParamsCache.get("status");
  const paymentStatus = searchParamsCache.get("payment_status");

  const filters: TGetBookingsFilters = {
    limit: pageLimit,
    page,
    ...(search && { search }),
    ...(status && { status }),
    ...(paymentStatus && { payment_status: paymentStatus }),
  };

  const user = await getCurrentUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const { total, bookings } = await getBookings(filters);

  return <BookingsTable columns={columns} data={bookings} totalItems={total} />;
}

