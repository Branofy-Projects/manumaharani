"use client";

import { useEffect, useState } from "react";

export function HeroVideo() {
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    // Defer video loading until after LCP paint
    const id = requestIdleCallback(() => setShowVideo(true));
    return () => cancelIdleCallback(id);
  }, []);

  if (!showVideo) return null;

  return (
    <video
      autoPlay
      className="absolute inset-0 w-full h-full object-cover object-center"
      loop
      muted
      playsInline
      preload="none"
    >
      <source
        src="https://ik.imagekit.io/teggaadfo/manu%20-%201080WebShareName.mov/ik-video.mp4?updatedAt=1760112353814"
        type="video/mp4"
      />
    </video>
  );
}
