"use client";

import { Pause, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

export type TReelBase = {
  createdAt: Date;
  description: string;
  id: string;
  redirectUrl: string;
  status: "active" | "inactive";
  title: string;
  updatedAt: Date;
  videoUrl: string;
};

interface ReelItemProps {
  isActive: boolean;
  isMuted: boolean;
  onToggleMute: () => void;
  reel: TReelBase;
}

export default function ReelsPage({ reels }: { reels: TReelBase[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [globalIsMuted, setGlobalIsMuted] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const scrollTop = containerRef.current.scrollTop;
        const windowHeight = window.innerHeight;
        const newIndex = Math.round(scrollTop / windowHeight);
        setCurrentIndex(newIndex);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const handleToggleMute = () => {
    setGlobalIsMuted(!globalIsMuted);
  };

  return (
    <div className="bg-black h-dvh max-w-md mx-auto relative">
      {/* Reels Container */}
      <div
        className="h-full overflow-y-scroll no-scrollbar snap-y snap-mandatory"
        ref={containerRef}
        style={{ scrollBehavior: "smooth" }}
      >
        {reels.map((reel, index) => (
          <div className="snap-start h-dvh" key={reel.id}>
            <ReelItem
              isActive={index === currentIndex}
              isMuted={globalIsMuted}
              onToggleMute={handleToggleMute}
              reel={reel}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function ReelItem({ isActive, isMuted, onToggleMute, reel }: ReelItemProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, [isActive]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  return (
    <div className="relative w-full h-dvh bg-black">
      {/* Video */}
      <video
        className="w-full h-full object-cover"
        loop
        muted
        onClick={togglePlay}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
        onTouchEnd={() => setTimeout(() => setShowControls(false), 2000)}
        onTouchStart={() => setShowControls(true)}
        playsInline
        ref={videoRef}
        src={reel.videoUrl}
      />

      {/* Play/Pause Overlay */}
      {showControls && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 transition-opacity duration-300"
          onClick={togglePlay}
        >
          {!isPlaying && (
            <div className="bg-black bg-opacity-50 rounded-full p-4">
              <Play className="w-12 h-12 text-white fill-white" />
            </div>
          )}
        </div>
      )}

      {/* Bottom Package Card Overlay */}
      <div className="absolute bottom-0 left-0 right-0  flex flex-col">
        {/* Video Controls */}
        <div className="pr-6 self-end flex flex-col space-y-4">
          {/* Play/Pause Button */}
          <button
            className="w-12 h-12 rounded-full bg-black bg-opacity-50 flex items-center justify-center hover:bg-opacity-70 transition-all lg:bg-[#2a2b20] md:backdrop-blur-sm"
            onClick={togglePlay}
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 text-white" />
            ) : (
              <Play className="w-6 h-6 text-white" />
            )}
          </button>

          {/* Mute/Unmute Button */}
          <button
            className="w-12 h-12 rounded-full bg-black bg-opacity-50 flex items-center justify-center hover:bg-opacity-70 transition-all backdrop-blur-sm"
            onClick={onToggleMute}
          >
            {isMuted ? (
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  clipRule="evenodd"
                  d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
                <path
                  d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 14.142M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            )}
          </button>
        </div>
        <Link className="p-4" href={reel.redirectUrl} target="_blank">
          <div className="bg-black/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
            <div className="flex items-start space-x-3">
              {/* Package Image */}
              <Image
                src="/android-chrome-512x512.png"
                // fill
                alt={reel.title}
                className="object-cover"
                height={64}
                width={64}
              />

              {/* Package Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold text-sm md:text-lg leading-tight mb-1">
                  {reel.title}
                </h3>
                <p
                  className="text-white/80 text-xs md:text-sm leading-relaxed mb-2 overflow-hidden"
                  style={{
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 2,
                  }}
                >
                  {reel.description}
                </p>

                {/* Package Count */}
                {/* <div className="flex items-center justify-between">
                  <span className="text-green-400 font-medium text-xs md:text-sm">
                    4+ Packages
                  </span>
                </div> */}
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
