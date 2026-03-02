"use client";

import { getActiveReels } from "@repo/actions/reels.actions";
import { Pause, Play, Volume2, VolumeX, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

type TReel = {
  description: string;
  id: number;
  redirect_url: string;
  title: string;
  video_url: string;
};

export default function ReelsFloatingButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [reels, setReels] = useState<TReel[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  const handleOpen = useCallback(async () => {
    if (isOpen) {
      setIsOpen(false);
      return;
    }

    setIsOpen(true);

    if (!hasFetched) {
      setLoading(true);
      try {
        const data = await getActiveReels();
        setReels(
          (data || []).map((r) => ({
            description: r.description,
            id: r.id,
            redirect_url: r.redirect_url,
            title: r.title,
            video_url: r.video_url,
          }))
        );
        setHasFetched(true);
      } catch (e) {
        console.error("Failed to load reels:", e);
      } finally {
        setLoading(false);
      }
    }
  }, [isOpen, hasFetched]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Floating Button */}
      <button
        aria-label="Watch Reels"
        className="fixed bottom-28 md:bottom-10 right-10 z-[999998] animate-pulse flex h-14 w-14 items-center justify-center rounded-full bg-black shadow-lg animate-pulse-ring cursor-pointer transition-transform hover:scale-110"
        onClick={handleOpen}
      >
        <Play className="h-6 w-6 text-white fill-white" />
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[999999] flex items-end justify-end sm:items-center sm:justify-end sm:p-6"
          onClick={handleClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 transition-opacity" />

          {/* Modal Container */}
          <div
            className="relative w-full h-full sm:w-[380px] sm:h-[85dvh] sm:max-h-[700px] sm:rounded-2xl bg-black overflow-hidden shadow-2xl transition-all duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 z-50 flex h-8 w-8 items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-sm hover:bg-white/30 transition-colors"
              onClick={handleClose}
            >
              <X className="h-4 w-4" />
            </button>

            {loading && (
              <div className="flex h-full items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent" />
              </div>
            )}

            {!loading && reels.length === 0 && hasFetched && (
              <div className="flex h-full items-center justify-center text-white/60 text-sm">
                No reels available
              </div>
            )}

            {!loading && reels.length > 0 && (
              <ReelsViewer isOpen={isOpen} reels={reels} />
            )}
          </div>
        </div>
      )}
    </>
  );
}

function ReelItem({
  isActive,
  isMuted,
  onToggleMute,
  reel,
}: {
  isActive: boolean;
  isMuted: boolean;
  onToggleMute: () => void;
  reel: TReel;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive) {
      video.play().catch(() => {
        video.muted = true;
        video.play().catch(() => { });
      });
      setIsPlaying(true);
    } else {
      video.pause();
      video.currentTime = 0;
      setIsPlaying(false);
    }
  }, [isActive]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play().catch(() => { });
      setIsPlaying(true);
    }
  };

  return (
    <div className="relative h-full w-full bg-black">
      <video
        className="h-full w-full object-cover cursor-pointer"
        loop
        muted
        onClick={togglePlay}
        playsInline
        preload={isActive ? "auto" : "none"}
        ref={videoRef}
        src={reel.video_url}
      />

      {/* Play/Pause overlay - visible when paused */}
      {!isPlaying && isActive && (
        <div
          className="absolute inset-0 flex items-center justify-center cursor-pointer"
          onClick={togglePlay}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black/40">
            <Play className="h-7 w-7 text-white fill-white" />
          </div>
        </div>
      )}

      {/* Bottom overlay */}
      <div className="absolute bottom-0 left-0 right-0 flex flex-col pointer-events-none">
        {/* Controls */}
        <div className="flex justify-end gap-3 px-4 mb-2 pointer-events-auto">
          <button
            className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
            onClick={togglePlay}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4 fill-white" />
            )}
          </button>
          <button
            className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
            onClick={onToggleMute}
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Info card */}
        <Link
          className="p-3 pointer-events-auto"
          href={reel.redirect_url}
          target="_blank"
        >
          <div className="rounded-xl bg-black/70 backdrop-blur-sm p-3 border border-white/10">
            <div className="flex items-start gap-3">
              <Image
                alt={reel.title}
                className="rounded-lg object-cover flex-shrink-0"
                height={48}
                src="/android-chrome-512x512.png"
                width={48}
              />
              <div className="min-w-0 flex-1">
                <h3 className="text-white font-semibold text-sm leading-tight mb-1 line-clamp-1">
                  {reel.title}
                </h3>
                {reel.description && (
                  <p className="text-white/70 text-xs leading-relaxed line-clamp-2">
                    {reel.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

function ReelsViewer({ isOpen, reels }: { isOpen: boolean; reels: TReel[]; }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const itemHeight = container.clientHeight;
      if (itemHeight > 0) {
        setCurrentIndex(Math.round(scrollTop / itemHeight));
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  // Reset scroll position when modal reopens
  useEffect(() => {
    if (isOpen && containerRef.current) {
      containerRef.current.scrollTop = 0;
      setCurrentIndex(0);
    }
  }, [isOpen]);

  return (
    <div
      className="h-full overflow-y-scroll snap-y snap-mandatory no-scrollbar"
      ref={containerRef}
    >
      {reels.map((reel, index) => (
        <div className="snap-start snap-always h-full" key={reel.id}>
          <ReelItem
            isActive={index === currentIndex && isOpen}
            isMuted={isMuted}
            onToggleMute={() => setIsMuted((m) => !m)}
            reel={reel}
          />
        </div>
      ))}
    </div>
  );
}
