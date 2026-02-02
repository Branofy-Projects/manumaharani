import React, { Suspense } from "react";

import BlogsLoadingSection from "./blogs-loading-section";
import BlogsSection from "./blogs-section";



export default function DiscoverManuMaharani() {
  return (
    <section className="w-full flex flex-col items-center py-10 md:py-20">
      <h2
        className="text-3xl md:text-4xl font-thin tracking-widest uppercase mb-4 text-center px-4 xl:px-0"
        style={{ color: "#000000" }}
      >
        DISCOVER MANU MAHARANI
      </h2>
      <p className="text-gray-700 max-w-screen-xl mx-auto text-base font-serif mb-8 md:mb-12 text-center px-4 xl:px-0">
        From spa rituals to chef‑led dinners, add small, thoughtful experiences
        to your stay to make your time in Corbett feel truly yours.
      </p>
      <Suspense fallback={<BlogsLoadingSection />}>
        <BlogsSection />
      </Suspense>
    </section>
  );
}
