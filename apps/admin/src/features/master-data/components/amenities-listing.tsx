import { getAmenities } from "@repo/actions";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth-utils";

import { AmenitiesTable } from "./amenities-tables";
import { columns } from "./amenities-tables/columns";

export default async function AmenitiesListingPage() {
  const user = await getCurrentUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const amenities = await getAmenities();

  return <AmenitiesTable columns={columns} data={amenities} totalItems={amenities.length} />;
}

