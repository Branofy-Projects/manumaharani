import { getContactQueries } from "@repo/actions";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth-utils";
import { searchParamsCache } from "@/lib/searchparams";

import { ContactQueriesTable } from "./contact-queries-table";
import { columns } from "./contact-queries-table/columns";

type TGetContactQueriesFilters = {
  limit?: number;
  page?: number;
  search?: string;
  status?: string;
};

export default async function ContactQueriesListingPage() {
  const page = searchParamsCache.get("page");
  const search = searchParamsCache.get("q");
  const pageLimit = searchParamsCache.get("perPage");
  const status = searchParamsCache.get("status");

  const filters: TGetContactQueriesFilters = {
    limit: pageLimit,
    page,
    ...(search && { search }),
    ...(status && { status }),
  };

  const user = await getCurrentUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const { contactQueries, total } = await getContactQueries(filters);

  return <ContactQueriesTable columns={columns} data={contactQueries} totalItems={total} />;
}
