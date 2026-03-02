import { Suspense } from "react";

import FormCardSkeleton from "@/components/form-card-skeleton";
import UserForm from "@/features/users/components/user-form";

export const metadata = {
  title: "Dashboard: Create User",
};

export default function NewUserPage() {
  return (
    <Suspense fallback={<FormCardSkeleton />}>
      <UserForm initialData={null} pageTitle="Create New User" />
    </Suspense>
  );
}
