import { getUserById } from "@repo/actions";
import { AppResponseHandler } from "@repo/actions/utils/app-response-handler";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import FormCardSkeleton from "@/components/form-card-skeleton";
import UserForm from "@/features/users/components/user-form";

export const metadata = {
  title: "Dashboard: Edit User",
};


export default async function EditUserPage(props: PageProps<"/user/[userId]">) {
  const params = await props.params;

  if (!params.userId || params.userId === "new") {
    notFound();
  }

  const result = await getUserById(params.userId);

  if (AppResponseHandler.isError(result)) {
    notFound();
  }

  const user = result;

  return (
    <Suspense fallback={<FormCardSkeleton />}>
      <UserForm
        initialData={user}
        pageTitle={`Edit User${user.name ? `: ${user.name}` : ""}`}
        userId={params.userId}
      />
    </Suspense>
  );
}