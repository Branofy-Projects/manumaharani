import dynamic from "next/dynamic";
import { Suspense } from "react";

import FeaturedOffers from "@/components/Home/featured-offers";
import { HomeHeroSection } from "@/components/Home/home-hero-section";
import HomeInstaImageSkeleton from "@/components/Home/home-insta-image-skeleton";
import SectionShortcuts from "@/components/Home/home-shortcuts";

const AccommodationsCarousel = dynamic(() => import("@/components/Home/accommodations-carousel"));
const JimCorbett = dynamic(() => import("@/components/Home/jim-corbett"));
const NearbyAttractions = dynamic(() => import("@/components/Home/nearby-attractions"));
const HomeInstaImageSection = dynamic(() => import("@/components/Home/home-insta-image-section"));
const DiscoverManuMaharani = dynamic(() => import("@/components/Home/discover-manu-maharani"));
const ExperienceButton = dynamic(() => import("@/components/Home/expreince-button"));
const ReelsFloatingButton = dynamic(() => import("@/components/Home/reels-floating-button"));

export default function Home() {
  return (
    <main>
      <HomeHeroSection />
      <SectionShortcuts />
      <FeaturedOffers />
      <AccommodationsCarousel />
      <JimCorbett />
      <NearbyAttractions />
      <Suspense fallback={<HomeInstaImageSkeleton />}>
        <HomeInstaImageSection />
      </Suspense>
      <DiscoverManuMaharani />
      <ExperienceButton />
      <ReelsFloatingButton />
    </main>
  );
}
