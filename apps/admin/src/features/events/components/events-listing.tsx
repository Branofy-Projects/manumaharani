import { getEvents } from "@repo/actions";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth-utils";
import { searchParamsCache } from "@/lib/searchparams";

import { EventsTable } from "./events-tables";
import { columns } from "./events-tables/columns";

type TGetEventsFilters = {
  limit?: number;
  page?: number;
  search?: string;
};

export default async function EventsListingPage() {
  const page = searchParamsCache.get("page");
  const search = searchParamsCache.get("q");
  const pageLimit = searchParamsCache.get("perPage");

  const filters: TGetEventsFilters = {
    limit: pageLimit,
    page,
    ...(search && { search }),
  };

  const user = await getCurrentUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const { events, total } = await getEvents(filters);

  return <EventsTable columns={columns} data={events} totalItems={total} />;
}
