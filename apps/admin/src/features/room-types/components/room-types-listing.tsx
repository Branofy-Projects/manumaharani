import { getRoomTypes } from "@repo/actions";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth-utils";
import { searchParamsCache } from "@/lib/searchparams";

import { RoomTypesTable } from "./room-types-tables";
import { columns } from "./room-types-tables/columns";

type TGetRoomTypesFilters = {
  limit?: number;
  page?: number;
  search?: string;
  status?: "active" | "inactive";
};

export default async function RoomTypesListingPage() {
  const page = searchParamsCache.get("page");
  const search = searchParamsCache.get("q");
  const pageLimit = searchParamsCache.get("perPage");
  const status = searchParamsCache.get("status");

  const filters: TGetRoomTypesFilters = {
    limit: pageLimit,
    page,
    ...(search && { search }),
    ...(status && { status: status as "active" | "inactive" }),
  };

  const user = await getCurrentUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const { roomTypes, total } = await getRoomTypes(filters);

  return <RoomTypesTable columns={columns} data={roomTypes} totalItems={total} />;
}

