import { getGallery } from "@repo/actions";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth-utils";
import { searchParamsCache } from "@/lib/searchparams";

import { GalleryTable } from "./gallery-tables";
import { columns } from "./gallery-tables/columns";

type TGetGalleryFilters = {
  search?: string;
  page?: number;
  limit?: number;
  category?: string;
  type?: string;
};

export default async function GalleryListingPage() {
  const page = searchParamsCache.get("page");
  const search = searchParamsCache.get("q");
  const pageLimit = searchParamsCache.get("perPage");
  const category = searchParamsCache.get("category");
  const type = searchParamsCache.get("type");

  const filters: TGetGalleryFilters = {
    limit: pageLimit,
    page,
    ...(search && { search }),
    ...(category && { category }),
    ...(type && { type }),
  };

  const user = await getCurrentUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const { total, gallery } = await getGallery(filters);

  return <GalleryTable columns={columns} data={gallery} totalItems={total} />;
}

