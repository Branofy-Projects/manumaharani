import React from "react";

import { Skeleton } from "@/components/ui/skeleton";

export default function UpcomingEventsSkeleton() {
  return (
    <div className="w-full lg:w-1/2 flex flex-col">
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-16" />
      </div>

      <div className="flex flex-col gap-6">
        {[1, 2, 3].map((_, idx) => (
          <div className="flex gap-4" key={idx}>
            {/* Date */}
            <div className="flex flex-col items-center justify-start pt-2 min-w-[60px]">
              <Skeleton className="h-8 w-8 mb-1" />
              <Skeleton className="h-4 w-8 mb-2" />
              <Skeleton className="h-3 w-10" />
            </div>

            {/* Image */}
            <Skeleton className="w-24 h-24 md:w-32 md:h-32 rounded-md shrink-0" />

            {/* Content */}
            <div className="flex flex-col justify-center py-2 flex-grow">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
