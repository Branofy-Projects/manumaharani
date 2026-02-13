import AccommodationsCarousel from "@/components/Home/accommodations-carousel";
import DiscoverManuMaharani from "@/components/Home/discover-manu-maharani";
import ExperienceButton from "@/components/Home/expreince-button";
import FeaturedOffers from "@/components/Home/featured-offers";
import { HomeHeroSection } from "@/components/Home/home-hero-section";
import HomeInstaImageSection from "@/components/Home/home-insta-image-section";
import SectionShortcuts from "@/components/Home/home-shortcuts";
import JimCorbett from "@/components/Home/jim-corbett";
import NearbyAttractions from "@/components/Home/nearby-attractions";

export default function Home() {
  return (
    <main>
      <HomeHeroSection />
      <SectionShortcuts />
      {/* <AboutSection /> */}
      <FeaturedOffers />
      <AccommodationsCarousel />
      {/* <FineDiningSection /> */}
      {/* <HomeExperiencesSection /> */}
      {/* <WeddingAiManuMaharani /> */}
      <JimCorbett />
      <NearbyAttractions />
      <HomeInstaImageSection />
      <DiscoverManuMaharani />

      <ExperienceButton />
    </main>
  );
}
