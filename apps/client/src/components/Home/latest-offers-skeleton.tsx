import React from "react";

import { Skeleton } from "@/components/ui/skeleton";

export default function LatestOffersSkeleton() {
  return (
    <div className="w-full lg:w-1/2 flex flex-col mt-10 lg:mt-0">
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-16" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[1, 2].map((_, idx) => (
          <div
            className="relative h-[400px] overflow-hidden rounded-lg"
            key={idx}
          >
            <Skeleton className="w-full h-full" />
            <div className="absolute bottom-0 left-0 w-full p-6">
              <Skeleton className="h-4 w-1/2 mb-2" />
              <Skeleton className="h-8 w-3/4 mb-2" />
              <Skeleton className="h-6 w-2/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
