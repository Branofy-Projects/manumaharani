import ReelsPage, { type TReelBase } from "./reel-page";

export default async function _ReelsPage() {
  const reels = [
    {
      description: "Reel 1 description",
      id: "1",
      redirectUrl: "/",
      title: "Reel 1",
      videoUrl:
        "https://storage.googleapis.com/etrouper-image-bucket/uploads/videos/1759498168477-whatsapp-video-2025-10-01-at-18.37.09.mp4",
    },
    {
      description: "Reel 2 description",
      id: "2",
      redirectUrl: "/",
      title: "Reel 2",
      videoUrl:
        "https://storage.googleapis.com/etrouper-image-bucket/uploads/videos/1759498168477-whatsapp-video-2025-10-01-at-18.37.09.mp4",
    },
    {
      description: "Reel 3 description",
      id: "3",
      redirectUrl: "/",
      title: "Reel 3",
      videoUrl:
        "https://storage.googleapis.com/etrouper-image-bucket/uploads/videos/1759498168477-whatsapp-video-2025-10-01-at-18.37.09.mp4",
    },
    {
      description: "Reel 4 description",
      id: "4",
      redirectUrl: "/",
      title: "Reel 4",
      videoUrl:
        "https://storage.googleapis.com/etrouper-image-bucket/uploads/videos/1759498168477-whatsapp-video-2025-10-01-at-18.37.09.mp4",
    },
  ];

  return <ReelsPage reels={reels as unknown as TReelBase[]} />;
}
