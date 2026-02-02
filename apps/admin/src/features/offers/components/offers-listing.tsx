import { getOffers } from "@repo/actions";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth-utils";
import { searchParamsCache } from "@/lib/searchparams";

import { OffersTable } from "./offers-tables";
import { columns } from "./offers-tables/columns";

type TGetOffersFilters = {
  limit?: number;
  page?: number;
  search?: string;
  status?: "active" | "inactive";
};

export default async function OffersListingPage() {
  const page = searchParamsCache.get("page");
  const search = searchParamsCache.get("q");
  const pageLimit = searchParamsCache.get("perPage");
  const _status = searchParamsCache.get("status");

  const status: "active" | "inactive" | undefined = _status ? ["active", "inactive"].includes(_status) ? _status as "active" | "inactive" : undefined : undefined;

  const filters: TGetOffersFilters = {
    limit: pageLimit,
    page,
    ...(search && { search }),
    ...(status && { status }),
  };

  const user = await getCurrentUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const { offers, total } = await getOffers(filters);

  return <OffersTable columns={columns} data={offers} totalItems={total} />;
}
