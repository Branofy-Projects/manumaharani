import { getFaqs } from "@repo/actions";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth-utils";

import { FaqsTable } from "./faqs-tables";
import { columns } from "./faqs-tables/columns";

export default async function FaqsListingPage() {
  const user = await getCurrentUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const faqs = await getFaqs();

  return <FaqsTable columns={columns} data={faqs} totalItems={faqs.length} />;
}

