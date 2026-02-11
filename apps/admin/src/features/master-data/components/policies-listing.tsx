import { getPolicies } from "@repo/actions/master-data.actions";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth-utils";

import { PoliciesTable } from "./policies-tables";
import { columns } from "./policies-tables/columns";

export default async function PoliciesListingPage() {
  const user = await getCurrentUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const policies = await getPolicies();

  return <PoliciesTable columns={columns} data={policies} totalItems={policies.length} />;
}

