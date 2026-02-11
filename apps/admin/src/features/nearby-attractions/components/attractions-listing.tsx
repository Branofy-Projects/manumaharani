import { getAttractions } from "@repo/actions";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth-utils";

import { AttractionsTable } from "./attractions-tables";
import { columns } from "./attractions-tables/columns";

export default async function AttractionsListingPage() {
  const user = await getCurrentUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const attractions = await getAttractions();

  return <AttractionsTable columns={columns} data={attractions} totalItems={attractions.length} />;
}
