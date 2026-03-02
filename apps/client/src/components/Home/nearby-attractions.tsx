import { Suspense } from "react";

import { getAttractionsCache } from "@/lib/cache/attractions.cache";

import { NearbyAttractionsCarousel } from "./nearby-attractions-carousel";

export default async function NearbyAttractions() {
  const attractions = await getAttractionsCache(true);

  if (attractions.length === 0) return null;

  return (
    <section className="flex w-full flex-col items-center py-10 md:py-20">
      <h2 className="text-3xl md:text-4xl tracking-widest uppercase mb-4 text-center px-4 xl:px-0 text-black">
        Nearby
      </h2>
      <p className="text-gray-700 text-base font-serif mb-8 md:mb-12 text-center px-4 xl:px-0">
        Extend your stay to discover lakes, hill towns, temples, and viewpoints
        around Corbett, all within comfortable driving distance from Manu
        Maharani.
      </p>
      <Suspense>
        <NearbyAttractionsCarousel attractions={attractions} />
      </Suspense>
    </section>
  );
}
