import Image from 'next/image';

import { RestaurantCarousel } from './restaurant-carousel';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  description: "Experience the pinnacle of fine dining at Manu Maharani",
  title: "Best Fine Dining & Bar in Jim Corbett | Riverside Restaurant | Manu Maharani Resorts & Spa",
};


const categories = [
  {
    blurb:
      "High-definition photos of the restaurant at 'Golden Hour' (sunset), candlelight setups by the Kosi River, and the architectural details of the dining hall.",
    image:
      "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=1600&auto=format&fit=crop",
    title: "The 'Vibe' Shots",
  },
  {
    blurb:
      "Include 'chef in action' shots—plating a delicate dish or a mixologist crafting a signature mocktail. This adds a human element of craftsmanship.",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1600&auto=format&fit=crop",
    title: "Action & Artistry",
  },
  {
    blurb:
      "Integrate 5-10 second 'Cinemagraphs' (photos with slight movement, like a flickering candle or a flowing river in the background) to make the page feel premium and modern.",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1600&auto=format&fit=crop",
    title: "The 2026 Trend",
  },
  {
    blurb:
      "Close-ups of fine linen, branded cutlery, and the 'Riverside Romance' setup to sell the experience to couples.",
    image:
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=600&q=80",
    title: "The Table Setting",
  },
];

export default function FineDiningPage() {
  return (
    <main className="w-full bg-white pt-[72px] md:pt-[88px]">
      {/* Hero Section */}
      <section className="relative h-[100vh] min-h-[500px] w-full overflow-hidden">
        <Image
          alt="Fine Dining at Manu Maharani"
          className="object-cover"
          fill
          priority
          src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2000&auto=format&fit=crop"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="flex items-center justify-center gap-4">
              <div className="h-[1px] w-16 bg-white/60" />
              <h1 className="font-serif text-5xl font-light tracking-[0.15em] md:text-6xl lg:text-7xl">
                A Culinary Journey by the Kosi: Riverside Fine Dining & Bar at Manu Maharani
              </h1>
              <div className="h-[1px] w-16 bg-white/60" />
            </div>
          </div>
        </div>
      </section>

      {/* Description Section */}
      <section className="w-full bg-white py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-4 text-center xl:px-0">
          <div className="mb-8 flex items-center justify-center gap-4">
            <div className="h-[1px] w-16 bg-[#2b2b2b]" />
            <h2 className="font-serif text-3xl font-light tracking-[0.15em] uppercase text-[#2b2b2b] md:text-4xl lg:text-5xl">
              Al-Fresco Dining & Bar by the Kosi River
            </h2>
            <div className="h-[1px] w-16 bg-[#2b2b2b]" />
          </div>
          <p className="font-serif text-base leading-relaxed text-[#5a5a5a] md:text-lg">
            Embark on a journey of exquisite experiences for the discerning
            connoisseur, seamlessly woven together with impeccable service,
            sophisticated ambience and masterful culinary artistry.
          </p>
        </div>
      </section>

      {/* Three Categories Section */}
      <section className="w-full bg-[#f8f8f8] py-16 md:py-24">
        <div className="mx-auto max-w-screen-xl px-4 xl:px-0">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
            {categories.map((category, idx) => (
              <div
                className="group cursor-pointer transition-all duration-300"
                key={idx}
              >
                <div className="relative mb-6 h-[300px] overflow-hidden md:h-[350px]">
                  <Image
                    alt={category.title}
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    fill
                    src={category.image}
                  />
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-[1px] w-8 bg-[#2b2b2b]" />
                  <h3 className="font-serif text-xl tracking-[0.08em] uppercase md:text-2xl">
                    {category.title}
                  </h3>
                </div>
                {/* <p className="font-serif text-sm leading-relaxed text-[#5a5a5a] md:text-base">
                  {category.blurb}
                </p> */}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Legendary Restaurant Brands Section */}
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
                In 2026, a high-converting luxury hotel website must treat its dining section as a standalone destination.
                Dedicated galleries and social proof (testimonials) are essential to convince non-residents to visit and guests to
                book a table before they even arrive.
              </p>
            </div>
          </div>

          <RestaurantCarousel />
        </div>
      </section>

      {/* Culinary Legacy Section */}
      <section className="relative h-[80vh] min-h-[600px] w-full overflow-hidden">
        <Image
          alt="A Culinary Legacy"
          className="object-cover"
          fill
          src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2000&auto=format&fit=crop"
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
            In 2026, luxury is visual and sensory. Your gallery should not just show "food on a plate," but the <b>entire
              atmosphere.</b>
          </p>
        </div>
      </section>

      {/* Call to Action */}
      <section className="w-full bg-[#2b2b2b] py-16 text-center md:py-20">
        <div className="mx-auto max-w-screen-xl px-4 xl:px-0">
          <h2 className="mb-6 font-serif text-3xl font-light tracking-[0.08em] uppercase text-white md:text-4xl">
            Reserve Your Table
          </h2>
          <p className="mb-8 font-serif text-base text-white/80 md:text-lg">
            Experience the pinnacle of fine dining at Manu Maharani
          </p>
          <button className="inline-block border border-[#c9a961] bg-transparent px-10 py-3 font-serif text-sm tracking-[0.08em] uppercase text-[#c9a961] transition-all hover:bg-[#c9a961] hover:text-white">
            Book Table
          </button>
        </div>
      </section>
    </main>
  );
}
