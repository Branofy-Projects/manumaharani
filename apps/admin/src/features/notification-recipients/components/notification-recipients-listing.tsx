import { getNotificationRecipients } from "@repo/actions";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth-utils";
import { searchParamsCache } from "@/lib/searchparams";

import { NotificationRecipientsTable } from "./notification-recipients-table";
import { columns } from "./notification-recipients-table/columns";

type TGetRecipientsFilters = {
  limit?: number;
  page?: number;
  search?: string;
};

export default async function NotificationRecipientsListingPage() {
  const page = searchParamsCache.get("page");
  const search = searchParamsCache.get("q");
  const pageLimit = searchParamsCache.get("perPage");

  const filters: TGetRecipientsFilters = {
    limit: pageLimit,
    page,
    ...(search && { search }),
  };

  const user = await getCurrentUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const { recipients, total } = await getNotificationRecipients(filters);

  return <NotificationRecipientsTable columns={columns} data={recipients} totalItems={total} />;
}
