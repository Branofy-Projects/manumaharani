import { redirect } from "next/navigation";

import { getActiveReelsCache } from "@/lib/cache/reels.cache";

import type { TReelBase } from "./reel-page";

import ReelsPage from "./reel-page";

export default async function _ReelsPage() {
  const dbReels = await getActiveReelsCache();

  if (!dbReels || dbReels.length === 0) {
    redirect("/");
  }

  const reels: TReelBase[] = dbReels.map((reel) => ({
    createdAt: reel.created_at,
    description: reel.description,
    id: String(reel.id),
    redirectUrl: reel.redirect_url,
    status: reel.status,
    title: reel.title,
    updatedAt: reel.updated_at,
    videoUrl: reel.video_url,
  }));

  return <ReelsPage reels={reels} />;
}
