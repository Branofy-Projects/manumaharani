import { getRooms } from "@repo/actions";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth-utils";
import { searchParamsCache } from "@/lib/searchparams";

import { RoomsTable } from "./rooms-tables";
import { columns } from "./rooms-tables/columns";

type TGetRoomsFilters = {
  search?: string;
  page?: number;
  limit?: number;
  status?: "available" | "occupied" | "maintenance" | "blocked";
  room_type_id?: number;
};

export default async function RoomsListingPage() {
  const page = searchParamsCache.get("page");
  const search = searchParamsCache.get("q");
  const pageLimit = searchParamsCache.get("perPage");
  const status = searchParamsCache.get("status");

  const filters: TGetRoomsFilters = {
    limit: pageLimit,
    page,
    ...(search && { search }),
    ...(status && { status: status as "available" | "occupied" | "maintenance" | "blocked" }),
  };

  const user = await getCurrentUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const { total, rooms } = await getRooms(filters);

  return <RoomsTable columns={columns} data={rooms} totalItems={total} />;
}

