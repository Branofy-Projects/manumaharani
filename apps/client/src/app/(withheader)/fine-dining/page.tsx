import Image from 'next/image';

import { FaqAccordion } from './faq-accordion';
import { RestaurantCarousel } from './restaurant-carousel';
import { TestimonialRotator } from './testimonial-rotator';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  description: "Discover chef-curated dining at Manu Maharani Resort & Spa — Nivalaya All Day Dining, Vyom Upper Deck Bar & Rasa Discotheque by the Kosi River, Jim Corbett. Book your table today.",
  title: "Fine Dining in Jim Corbett | Nivalaya, Vyom & Rasa | Manu Maharani Resort & Spa",
};

const specialExperiences = [
  {
    dresscode: "Smart Casual",
    image: "https://storage.googleapis.com/manumaharani-files-bucket/static/1772469048073-The_Table_Setting.webp",
    includes: "Private table, Infinity Pool deck + personal butler",
    name: '"Gourmet Grill" Private Dinner',
    primaryCta: { href: "#book", label: "Book a Table" },
    tag: "Buffet service",
    timing: "7:00 PM – 10:30 PM",
  },
  {
    dresscode: "Resort Casual",
    image: "https://storage.googleapis.com/manumaharani-files-bucket/static/1772469050230-vyom-vibeshot.webp",
    includes: "Guests + naturalist peaks + artisanal cocktails",
    name: "Sunset Spark at Vyom",
    primaryCta: { href: "#book", label: "Book a Table" },
    tag: "Sunset at bar",
    timing: "5:00 PM – 8:00 PM",
  },
  {
    dresscode: "Comfortable & Outdoors",
    image: "https://storage.googleapis.com/manumaharani-files-bucket/static/1772469040343-Action___Artistry.webp",
    includes: "Artisanal basket in Jeep setting",
    name: "The Safari Picnic Hamper",
    primaryCta: { href: "#book", label: "Book a Table" },
    tag: "Jazz Night",
    timing: "6:00 AM – 9:00 AM",
  },
];

const ugcImages = [
  "https://storage.googleapis.com/manumaharani-files-bucket/static/1772469048073-The_Table_Setting.webp",
  "https://storage.googleapis.com/manumaharani-files-bucket/static/1772469050230-vyom-vibeshot.webp",
  "https://storage.googleapis.com/manumaharani-files-bucket/static/1772469042731-Nivalya_.webp",
  "https://storage.googleapis.com/manumaharani-files-bucket/static/1772469040343-Action___Artistry.webp",
  "https://storage.googleapis.com/manumaharani-files-bucket/static/1772469044696-The_2026_Trend.webp",
  "https://storage.googleapis.com/manumaharani-files-bucket/static/1772469048073-The_Table_Setting.webp",
];

const categories = [
  {
    image: "https://storage.googleapis.com/manumaharani-files-bucket/static/1772469050230-vyom-vibeshot.webp",
    title: "The 'Vibe' Shots",
  },
  {
    image: "https://storage.googleapis.com/manumaharani-files-bucket/static/1772469040343-Action___Artistry.webp",
    title: "Action & Artistry",
  },
  {
    image: "https://storage.googleapis.com/manumaharani-files-bucket/static/1772469044696-The_2026_Trend.webp",
    title: "The 2026 Trend",
  },
  {
    image: "https://storage.googleapis.com/manumaharani-files-bucket/static/1772469048073-The_Table_Setting.webp",
    title: "The Table Setting",
  },
];

export default function FineDiningPage() {
  return (
    <main className="w-full bg-white">

      {/* SECTION 1 — Hero (Visual Gastronomy) */}
      <section className="relative min-h-[100dvh] w-full overflow-hidden">
        <video
          autoPlay
          className="absolute inset-0 h-full w-full object-cover"
          loop
          muted
          playsInline
          poster="https://storage.googleapis.com/manumaharani-files-bucket/static/1772469042731-Nivalya_.webp"
        >
          <source src="" type="video/mp4" />
        </video>
        <Image
          alt="Fine Dining at Manu Maharani Resort — Kosi River at Dusk, Jim Corbett"
          className="object-cover"
          fill
          priority
          sizes="100vw"
          src="https://storage.googleapis.com/manumaharani-files-bucket/static/1772469042731-Nivalya_.webp"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/75" />
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-16 md:pb-24 px-4 pt-[72px] md:pt-[88px] text-center">
          <h1 className="text-2xl md:text-4xl tracking-[0.2em] md:tracking-[0.3em] uppercase text-white leading-tight mb-4 whitespace-nowrap">
            A Symphony of Flavors by the Kosi.
          </h1>
          <p className="font-serif text-base md:text-lg italic text-white/90 max-w-2xl mb-8">
            From riverside grills to panoramic peaks — discover the heart of Corbett&apos;s culinary heritage.
          </p>
          <a
            className="flex flex-col items-center gap-1 text-[#c9a961] font-serif text-sm tracking-widest animate-bounce"
            href="#experience-cards"
          >
            <span>↓ Scroll to Explore</span>
          </a>
        </div>
      </section>

      {/* Special Experiences — just below hero */}
      <section className="w-full bg-[#faf9f7] py-16 md:py-24" id="experience-cards">
        <div className="mx-auto max-w-screen-xl px-4 xl:px-0">

          {/* Location & Contact Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border border-[#e8e4dc] px-5 py-4 mb-10 bg-white">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <span className="font-serif text-sm font-semibold text-[#2b2b2b]">Manu Maharani Resort & Spa, Jim Corbett</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <svg className="w-3.5 h-3.5 text-[#c9a961] fill-current" key={i} viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
                <svg className="w-3.5 h-3.5 text-[#e0ddd8] fill-current" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
                <span className="font-serif text-xs text-[#5a5a5a] ml-1">4.3 · 200+ Reviews</span>
              </div>
            </div>
            <div className="flex items-center gap-5">
              <a className="flex items-center gap-1.5 font-serif text-xs tracking-wide text-[#c9a961] hover:underline" href="https://maps.google.com/?q=Manu+Maharani+Resort+Jim+Corbett" rel="noopener noreferrer" target="_blank">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                  <circle cx="12" cy="9" r="2.5" />
                </svg>
                View Map
              </a>
              <a className="flex items-center gap-1.5 font-serif text-xs tracking-wide text-[#5a5a5a] hover:text-[#2b2b2b]" href="tel:+911234567890">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.01 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                </svg>
                +91 124-456-7890
              </a>
            </div>
          </div>

          {/* Tagline */}
          <div className="mb-10">
            <p className="font-serif text-xl md:text-2xl font-semibold underline underline-offset-4 text-[#2b2b2b] italic mb-2">
              &ldquo;for your special moments, find us:&rdquo;
            </p>
            <p className="font-serif text-sm text-[#8a8a8a]">
              Curated experiences by Manu Maharani — private dinners, wildlife safaris & sundowner sessions.
            </p>
          </div>

          {/* Special Experience Cards */}
          <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide md:grid md:grid-cols-3 md:overflow-visible md:pb-0">
            {specialExperiences.map((exp, idx) => (
              <div
                className="min-w-[75vw] sm:min-w-[55vw] md:min-w-0 flex-shrink-0 snap-start border border-[#e8e4dc] bg-white flex flex-col"
                key={idx}
              >
                <div className="px-5 pt-5 pb-3 text-center">
                  <span className="font-serif text-xs tracking-widest text-[#c9a961]">★ {exp.tag}</span>
                </div>
                <div className="relative h-40 overflow-hidden mx-5">
                  <Image
                    alt={exp.name}
                    className="object-cover"
                    fill
                    sizes="(max-width: 768px) 75vw, 33vw"
                    src={exp.image}
                  />
                </div>
                <div className="px-5 pt-3 pb-5 flex flex-col gap-3 flex-1">
                  <p className="font-serif text-xs italic text-[#8a8a8a] text-center">{exp.includes}</p>
                  <h3 className="font-serif text-base font-bold text-[#2b2b2b] text-center">{exp.name}</h3>
                  <a
                    className="text-center bg-[#2b2b2b] px-4 py-3 font-serif text-xs tracking-[0.15em] uppercase text-white transition-all hover:bg-[#c9a961] min-h-[44px] flex items-center justify-center mt-auto"
                    href={exp.primaryCta.href}
                  >
                    {exp.primaryCta.label}
                  </a>
                  <div className="flex gap-2 justify-center flex-wrap">
                    <span className="border border-[#e8e4dc] px-3 py-1.5 font-serif text-[10px] tracking-wide text-[#5a5a5a] flex items-center gap-1">
                      <svg className="w-3 h-3 text-[#c9a961]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                      {exp.timing}
                    </span>
                    <span className="border border-[#e8e4dc] px-3 py-1.5 font-serif text-[10px] tracking-wide text-[#5a5a5a]">
                      {exp.dresscode}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Description Section — existing content */}
      <section className="w-full bg-white py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-4 text-center xl:px-0">
          <div className="mb-8 flex items-center justify-center gap-4">
            <div className="h-[1px] w-16 bg-[#2b2b2b]" />
            <h2 className="font-serif text-3xl font-light tracking-[0.15em] uppercase text-[#2b2b2b] md:text-4xl lg:text-5xl">
              Exquisite Tastes. Sophisticated Spaces.
            </h2>
            <div className="h-[1px] w-16 bg-[#2b2b2b]" />
          </div>
          <p className="font-serif text-base leading-relaxed text-[#5a5a5a] md:text-lg">
            Seamless service meets masterful culinary craft. Welcome to a dining experience designed for the discerning.
          </p>
        </div>
      </section>

      {/* Categories Grid — existing content */}
      <section className="w-full bg-[#f8f8f8] py-16 md:py-24">
        <div className="mx-auto max-w-screen-xl px-4 xl:px-0">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
            {categories.map((category, idx) => (
              <div className="group cursor-pointer transition-all duration-300" key={idx}>
                <div className="relative mb-6 h-[300px] overflow-hidden md:h-[350px]">
                  <Image
                    alt={category.title}
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    src={category.image}
                  />
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-[1px] w-8 bg-[#2b2b2b]" />
                  <h3 className="font-serif text-xl tracking-[0.08em] uppercase md:text-2xl">
                    {category.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Legendary Restaurant Brands — existing content */}
      <section className="w-full bg-white py-16 md:py-24">
        <div className="mx-auto max-w-screen-xl px-4 xl:px-0">
          <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-16">
            <div>
              <div className="mb-6 flex items-center gap-3">
                <div className="h-[1px] w-12 bg-[#2b2b2b]" />
                <h2 className="font-serif text-3xl font-light tracking-[0.08em] uppercase md:text-4xl lg:text-5xl">
                  Our Legendary Restaurant Brands
                </h2>
              </div>
            </div>
            <div className="flex items-center">
              <p className="font-serif text-base leading-relaxed text-[#5a5a5a] md:text-lg">
                At Manu Maharani Resort & Spa, dining is more than just a meal — it is an experience crafted with flavor,
                ambiance, and nature. Surrounded by lush greenery and the soothing presence of the Kosi River, our culinary
                spaces offer a harmonious blend of global cuisines and regional delicacies.
              </p>
            </div>
          </div>
          <RestaurantCarousel />
        </div>
      </section>


      {/* Culinary Legacy — existing content */}
      <section className="relative h-[80vh] min-h-[600px] w-full overflow-hidden">
        <Image
          alt="A Culinary Legacy at Manu Maharani Resort Jim Corbett"
          className="object-cover"
          fill
          sizes="100vw"
          src="https://storage.googleapis.com/manumaharani-files-bucket/static/1772469048073-The_Table_Setting.webp"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 lg:p-24">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-[1px] w-12 bg-white/80" />
            <h2 className="font-serif text-3xl font-light tracking-[0.15em] uppercase text-white md:text-4xl lg:text-5xl">
              A Culinary Legacy
            </h2>
          </div>
          <p className="max-w-2xl font-serif text-base leading-relaxed text-white/90 md:text-lg">
            Every dish at Manu Maharani is a reflection of our philosophy — to combine authentic flavors with warm
            hospitality. Whether you seek indulgence, comfort, or a fine dining escape, our restaurants promise an
            experience that lingers long after your meal.
          </p>
        </div>
      </section>

      {/* SECTION 4 — Social Proof & Guest Palette */}
      <section className="w-full bg-[#faf9f7] py-16 md:py-24">
        <div className="mx-auto max-w-screen-xl px-4 xl:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-[#e8e4dc]">

            {/* Left — Rotating Testimonial */}
            <div className="p-8 md:p-10 border-b md:border-b-0 md:border-r border-[#e8e4dc] bg-white flex flex-col">
              <div className="flex items-center gap-2 mb-5">
                <span className="block w-2.5 h-2.5 rounded-full bg-[#c9a961]" />
                <span className="font-serif text-xs tracking-[0.2em] uppercase text-[#5a5a5a]">Guest Testimonial</span>
              </div>
              <TestimonialRotator />
              <p className="font-serif text-[10px] tracking-wide text-[#b0aba3] mt-6">
                ⊙ Rotating testimonials — auto-cycle every 5 sec
              </p>
            </div>

            {/* Right — Instagram UGC */}
            <div className="p-8 md:p-10 bg-white flex flex-col">
              <p className="font-serif text-xs tracking-[0.2em] uppercase text-[#c9a961] mb-5">
                Instagram UGC Feed — #ManuMaharaniEats
              </p>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {ugcImages.map((src, i) => (
                  <div className="relative aspect-square overflow-hidden bg-[#e8e4dc]" key={i}>
                    <Image
                      alt={`Guest dining photo ${i + 1} — Manu Maharani Jim Corbett`}
                      className="object-cover hover:scale-105 transition-transform duration-500"
                      fill
                      sizes="(max-width: 768px) 33vw, 16vw"
                      src={src}
                    />
                  </div>
                ))}
              </div>
              <p className="font-serif text-[10px] tracking-wide text-[#b0aba3] text-center mt-1">
                [ Real guest photos — #ManuMaharaniEats ]
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 6 — FAQ */}
      <section className="w-full bg-white py-16 md:py-24">
        <div className="mx-auto max-w-screen-xl px-4 xl:px-0">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-12 md:gap-20">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-[1px] w-8 bg-[#2b2b2b]" />
                <p className="font-serif text-xs tracking-[0.3em] uppercase text-[#c9a961]">FAQs</p>
              </div>
              <h2 className="font-serif text-3xl md:text-4xl font-light tracking-[0.08em] uppercase text-[#2b2b2b] leading-tight">
                Frequently Asked Questions
              </h2>
            </div>
            <FaqAccordion />
          </div>
        </div>
      </section>

      {/* SECTION 5 — Sticky Mobile Quick Reserve Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden border-t border-[#e8e4dc] bg-white shadow-[0_-4px_12px_rgba(0,0,0,0.08)]">
        <a
          className="flex-1 py-4 font-serif text-xs tracking-[0.2em] uppercase text-[#2b2b2b] text-center border-r border-[#e8e4dc] hover:bg-[#faf9f7] transition-colors min-h-[44px] flex items-center justify-center"
          href="#experience-cards"
        >
          View All Menus
        </a>
        <a
          className="flex-1 py-4 font-serif text-xs tracking-[0.2em] uppercase text-white text-center bg-[#2b2b2b] hover:bg-[#c9a961] transition-colors min-h-[44px] flex items-center justify-center"
          href="#book"
        >
          Reserve Now
        </a>
      </div>

    </main>
  );
}
