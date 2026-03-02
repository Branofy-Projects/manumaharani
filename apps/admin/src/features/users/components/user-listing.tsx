import { getUsers } from "@repo/actions/users/user-actions.server";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth-utils";
import { searchParamsCache } from "@/lib/searchparams";

import { UserTable } from "./user-tables";
import { columns } from "./user-tables/columns";

import type { TGetUsersFilters } from "@repo/actions/users/user-actions.types";

export default async function UserListingPage() {
  // Showcasing the use of search params cache in nested RSCs
  const page = searchParamsCache.get("page");
  const pageLimit = searchParamsCache.get("perPage");
  const roles = searchParamsCache.get("roles");
  // Table toolbar syncs filters to URL by column id (name, email); also support global "q"
  const search =
    searchParamsCache.get("name") ??
    searchParamsCache.get("email") ??
    searchParamsCache.get("q");

  const filters: TGetUsersFilters = {
    limit: pageLimit,
    page,
    ...(search && { search }),
    ...(roles && roles.length > 0 && { roles }),
  };

  const user = await getCurrentUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const { total, users } = await getUsers(filters);

  return <UserTable columns={columns} data={users} totalItems={total} />;
}