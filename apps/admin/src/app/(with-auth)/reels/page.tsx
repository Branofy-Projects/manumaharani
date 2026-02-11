import { getReels } from "@repo/actions";
import { redirect } from "next/navigation";

import PageContainer from "@/components/layout/page-container";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import ReelsManager from "@/features/reels/components/reels-manager";
import { getCurrentUser } from "@/lib/auth-utils";

export const metadata = {
  title: "Dashboard: Reels",
};

export default async function ReelsPage() {
  const user = await getCurrentUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const { reels } = await getReels();

  return (
    <PageContainer scrollable>
      <div className="flex flex-1 flex-col space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            description="Manage video reels for the client site"
            title="Reels"
          />
        </div>
        <Separator />
        <ReelsManager initialReels={reels} />
      </div>
    </PageContainer>
  );
}
