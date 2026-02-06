import { getBlogs } from "@repo/actions";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth-utils";
import { searchParamsCache } from "@/lib/searchparams";

import { BlogsTable } from "./blogs-tables";
import { columns } from "./blogs-tables/columns";

type TGetBlogsFilters = {
  category?: string;
  limit?: number;
  page?: number;
  search?: string;
  status?: "archived" | "draft" | "published";
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
    ...(status && { status: status as "archived" | "draft" | "published" }),
  };

  const user = await getCurrentUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const { blogs, total } = await getBlogs(filters);

  return <BlogsTable columns={columns} data={blogs} totalItems={total} />;
}

