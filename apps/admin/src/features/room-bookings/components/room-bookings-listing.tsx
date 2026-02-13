import { getRoomBookings } from "@repo/actions";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth-utils";
import { searchParamsCache } from "@/lib/searchparams";

import { RoomBookingsTable } from "./room-bookings-table";
import { columns } from "./room-bookings-table/columns";

type TGetRoomBookingsFilters = {
  limit?: number;
  page?: number;
  search?: string;
  status?: string;
};

export default async function RoomBookingsListingPage() {
  const page = searchParamsCache.get("page");
  const search = searchParamsCache.get("q");
  const pageLimit = searchParamsCache.get("perPage");
  const status = searchParamsCache.get("status");

  const filters: TGetRoomBookingsFilters = {
    limit: pageLimit,
    page,
    ...(search && { search }),
    ...(status && { status }),
  };

  const user = await getCurrentUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const { roomBookings, total } = await getRoomBookings(filters);

  return <RoomBookingsTable columns={columns} data={roomBookings} totalItems={total} />;
}
