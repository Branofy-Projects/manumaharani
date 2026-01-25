import React, { Suspense } from "react";

import LatestOffers from "./latest-offers";
import LatestOffersSkeleton from "./latest-offers-skeleton";
import UpcomingEvents from "./upcoming-events";
import UpcomingEventsSkeleton from "./upcoming-events-skeleton";

export default function FeaturedOffers() {
  return (
    <section className="w-full max-w-screen-xl mx-auto py-12 md:py-24 px-4 xl:px-0">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
        <Suspense fallback={<UpcomingEventsSkeleton />}>
          <UpcomingEvents />
        </Suspense>
        <Suspense fallback={<LatestOffersSkeleton />}>
          <LatestOffers />
        </Suspense>
      </div>
    </section>
  );
}
