import React from "react";

import { Skeleton } from "@/components/ui/skeleton";

export const HomeExperiencesSectionLoader = () => {
  return (
    <section
      className="relative flex h-full w-full flex-col items-center justify-center py-12 sm:py-16 md:py-20"
      id="experiences"
      style={{
        // Optional: Keep the background if you want the loader to have the same backdrop
        // or remove these styles if you want a plain background during loading
        backgroundAttachment: "fixed",
        backgroundImage:
          "url(https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80)",
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <div className="pointer-events-none absolute inset-0 z-0 bg-black/70" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Title Skeleton */}
        <div className="flex flex-col items-center justify-center gap-2 mb-10 sm:mb-12 md:mb-20">
          <Skeleton className="h-8 w-48 rounded-lg bg-white/20 sm:h-10 sm:w-64 md:h-12 md:w-80" />
          <Skeleton className="h-8 w-32 rounded-lg bg-white/20 sm:h-10 sm:w-48 md:h-12 md:w-60" />
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-2 gap-6 place-items-center sm:gap-8 md:gap-10 lg:grid-cols-4 lg:gap-12">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div className="flex flex-col items-center text-center" key={idx}>
              {/* Circle Image Skeleton */}
              <Skeleton className="h-32 w-32 rounded-full ring-4 ring-white/10 bg-white/20 sm:h-40 sm:w-40 md:h-48 md:w-48 lg:h-56 lg:w-56" />

              {/* Text Label Skeleton */}
              <Skeleton className="mt-4 h-4 w-24 rounded bg-white/20 sm:h-5 sm:w-32 md:h-6 md:w-40" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};