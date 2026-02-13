import Image from 'next/image';
import React from 'react';

import WeddingAiManuMaharani from '@/components/Home/wedding-ai-manu-maharani';
import WeddingFestivities from '@/components/WeddingFestivities';
import WeddingVenue from '@/components/WeddingVenue';

const festivities = [
  {
    description:
      "Romantic riverside escapes with candlelit dinners, spa treatments, and private Kosi River safaris for newlyweds.",
    id: "honeymoons",
    image:
      "https://images.unsplash.com/photo-1520975867597-0f2b0b1b8c6b?q=80&w=1600&auto=format&fit=crop",
    label: "Honeymoons",
  },
  {
    description:
      "Intimate riverside ceremonies reaffirming love with Corbett mountain backdrop and personalized rituals.",
    id: "renewal-of-vows",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600&auto=format&fit=crop",
    label: "Vow Renewals",
  },
  {
    description:
      "Cinematic pre-wedding shoots along Kosi River, jungle trails, and resort lawns with professional photographers.",
    id: "couple-shoots",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600&auto=format&fit=crop",
    label: "Couple Shoots",
  },
  {
    description:
      "Private ladies' gatherings with henna, games, and bespoke high tea overlooking Corbett wilderness.",
    id: "cocktail-parties",
    image:
      "https://images.unsplash.com/photo-1532634896-26909d0d4b6a?q=80&w=1600&auto=format&fit=crop",
    label: "Cocktail Parties",
  },
  {
    description:
      "Private ladies' gatherings with henna, games, and bespoke high tea overlooking Corbett wilderness.",
    id: "bridal-shower",
    image:
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1600&auto=format&fit=crop",
    label: "Bridal Shower",
  },
  {
    description: "Vibrant morning turmeric ceremony on riverside lawns with flower swings, natural backdrops, and blessing rituals.",
    id: "haldi",
    image:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=1600&auto=format&fit=crop",
    label: "Haldi",
  },
  {
    description: "Evening henna celebration with live dhol, lanterns, professional artists, and folk dance performances by the river.",
    id: "mehndi",
    image:
      "https://images.unsplash.com/photo-1603521216931-1f5d4dfb9f30?q=80&w=1600&auto=format&fit=crop",
    label: "Mehndi",
  },

  {
    description:
      "Grand open-air dance celebration with Bollywood DJ, LED stage, professional dance floor, and live performances",
    id: "sangeet",
    image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1600&auto=format&fit=crop",
    label: "Sangeet",
  },
  {
    description:
      "Surprise proposal setups with rose petals, champagne, and private Kosi River viewpoints for perfect moments.",
    id: "proposals",
    image:
      "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?q=80&w=1600&auto=format&fit=crop",
    label: "Proposal",
  },
]

const destinations = [
  {
    blurb:
      "3 expansive open-air lawns perfect for pheras, sangeet, and grand receptions with the Kosi River flowing beside you. Accommodates 100-500 guests with riverside mandaps and sunset ceremonies.",
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1600&auto=format&fit=crop",
    title: "Riverside Lawns",
  },
  {
    blurb:
      "2 climate-controlled halls for intimate ceremonies or large receptions. Ideal for baraat, pheras, and dinner with full AV setup and elegant lighting.",
    image:
      "https://images.unsplash.com/photo-1512455102796-467984917f4e?q=80&w=1600&auto=format&fit=crop",
    title: "Banquet Halls",
  },
  {
    blurb:
      "Breathtaking Himalayan foothill views for photoshoots and ceremonies. Combine wedding rituals with morning safaris for guests seeking adventure.",
    image:
      "https://images.unsplash.com/photo-1473172707857-f9e276582ab6?q=80&w=1600&auto=format&fit=crop",
    title: "Corbett Mountain Vows",
  }
];

export default function Page() {
  return (
    <main className="bg-white pt-[72px] md:pt-[88px]">
      {/* Hero */}
      <section className="relative w-full min-h-[70vh] md:min-h-[80vh] flex items-center">
        <div className="absolute inset-0">
          <Image
            alt="Timeless Weddings"
            className="object-cover"
            fill
            priority
            sizes="100vw"
            src="https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=2000&auto=format&fit=crop"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 w-full">
          <div className="max-w-screen-xl mx-auto px-4 xl:px-0 py-16 md:py-24">
            <p className="text-white/90 font-serif italic text-sm md:text-base">
              The Wedding Destination in Jim Corbett
            </p>
            <h1 className="mt-2 text-white text-3xl md:text-5xl font-thin tracking-[0.2em] md:tracking-[0.3em] uppercase leading-tight">
              Riverside Weddings
            </h1>
            <p className="mt-4 max-w-2xl text-white/90 text-sm md:text-base">
              Celebrate your love story beside the Kosi River with Corbett's wilderness as witness.
              Lavish lawns, elegant banquets, and personalized rituals for unforgettable
              beginnings.
            </p>
            <div className="mt-8">
              <a
                className="inline-block bg-[#2b2b2b] text-[#f4efe8] px-6 py-3 text-xs md:text-sm tracking-widest uppercase"
                href="#plan"
              >
                Plan Your Corbett Wedding
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Destination Weddings */}
      <section className="w-full py-16 md:py-24" id="wedding-destination">
        <div className="max-w-screen-xl mx-auto px-4 xl:px-0">
          {/* Heading + description to match reference */}
          <div className="mb-8 md:mb-12 grid grid-cols-1 lg:grid-cols-[auto_1fr] items-start gap-6">
            <div className="flex items-center gap-4">
              <div className="h-px bg-black/20 w-16" />
              <h2 className="text-2xl md:text-4xl font-thin tracking-[0.08em] uppercase">
                Corbett Wedding Venues
              </h2>
            </div>
            <p className="text-sm md:text-base font-serif text-[#2b2b2b]/80 lg:pl-8">
              Nestled along the Kosi River, Manu Maharani Resort offers 2 elegant banquet halls
              and 3 expansive open lawns perfect for destination weddings in Jim Corbett. Host
              every ritual—from mehndi to reception—across scenic riverside settings with Corbett
              safaris as your wedding backdrop.
            </p>
          </div>
        </div>

        {/* Full-bleed carousel: only center slides; sides show titles */}
      <WeddingVenue destinations={destinations} />
      </section>

      {/* Wedding Festivities */}
      <WeddingFestivities initialIndex={2} items={festivities} />

      {/* Editorial/press style wedding grid */}
      <WeddingAiManuMaharani />

      {/* CTA */}
      <section className="w-full py-16 md:py-24" id="plan">
        <div className="max-w-screen-xl mx-auto px-4 xl:px-0">
          <div className="bg-[#000000] text-[#b68833] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl md:text-2xl tracking-widest uppercase font-thin">
                Plan Your Corbett Wedding
              </h3>
              <p className="mt-2 text-xs md:text-sm font-serif text-white/80">
                Speak to our wedding specialists to craft bespoke celebrations across riverside
                lawns and elegant banquets. Packages from intimate gatherings to 500-guest
                events.
              </p>
            </div>
            <a
              className="bg-[#f4efe8] text-[#2b2b2b] px-6 py-3 text-xs md:text-sm tracking-widest uppercase"
              href="#contact"
            >
              Enquire Now
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
