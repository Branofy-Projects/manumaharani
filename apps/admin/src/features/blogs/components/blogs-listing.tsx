import { getBlogs } from "@repo/actions";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth-utils";
import { searchParamsCache } from "@/lib/searchparams";

import { BlogsTable } from "./blogs-tables";
import { columns } from "./blogs-tables/columns";

type TGetBlogsFilters = {
  search?: string;
  page?: number;
  limit?: number;
  status?: "draft" | "published" | "archived";
  category?: string;
};

export default async function BlogsListingPage() {
  const page = searchParamsCache.get("page");
  const search = searchParamsCache.get("q");
  const pageLimit = searchParamsCache.get("perPage");
  const status = searchParamsCache.get("status");

  const filters: TGetBlogsFilters = {
    limit: pageLimit,
    page,
    ...(search && { search }),
    ...(status && { status: status as "draft" | "published" | "archived" }),
  };

  const user = await getCurrentUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const { total, blogs } = await getBlogs(filters);

  return <BlogsTable columns={columns} data={blogs} totalItems={total} />;
}

