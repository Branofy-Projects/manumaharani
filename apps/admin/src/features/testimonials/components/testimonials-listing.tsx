import { getTestimonials } from "@repo/actions";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth-utils";
import { searchParamsCache } from "@/lib/searchparams";

import { TestimonialsTable } from "./testimonials-tables";
import { columns } from "./testimonials-tables/columns";

type TGetTestimonialsFilters = {
  limit?: number;
  page?: number;
  search?: string;
  status?: "approved" | "pending" | "rejected";
};

export default async function TestimonialsListingPage() {
  const page = searchParamsCache.get("page");
  const search = searchParamsCache.get("q");
  const pageLimit = searchParamsCache.get("perPage");
  const status = searchParamsCache.get("status");

  const filters: TGetTestimonialsFilters = {
    limit: pageLimit,
    page,
    ...(search && { search }),
    ...(status && { status: status as "approved" | "pending" | "rejected" }),
  };

  const user = await getCurrentUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const { testimonials, total } = await getTestimonials(filters);

  return <TestimonialsTable columns={columns} data={testimonials} totalItems={total} />;
}

