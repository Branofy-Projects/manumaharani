import Image from 'next/image';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  description: "Experience fine dining at Manu Maharani Resort & Spa — Nivalaya, Vyom & Rasa restaurants by the Kosi River in Jim Corbett",
  title: "Best Fine Dining & Bar in Jim Corbett | Riverside Restaurant | Manu Maharani Resorts & Spa",
};

const restaurants = [
  {
    description:
      "Nivalaya is our all-day dining restaurant, offering a vibrant spread of global and Indian cuisines in a warm, welcoming setting. Perfect for families and groups, it brings together rich flavors and comforting classics.",
    highlights: [
      "Lavish breakfast, lunch & dinner buffets",
      "Indian, Continental & regional Kumaoni specialties",
      "Fresh, locally sourced ingredients",
      "Elegant indoor seating with serene views",
    ],
    image:
      "https://storage.googleapis.com/manumaharani-files-bucket/static/1772469042731-Nivalya_.webp",
    name: "Nivalaya",
    tagline: "The Essence of Wholesome Dining",
  },
  {
    description:
      "Vyom offers a magical open-air dining experience, where the sky becomes your ceiling. Whether it's a romantic dinner or a relaxed evening with friends, Vyom creates unforgettable moments under the stars.",
    highlights: [
      "Open-air, rooftop-style ambiance",
      "Perfect for romantic dinners & private celebrations",
      "Curated menus with grills, live counters & signature dishes",
      "Evening experiences with soft lighting and music",
    ],
    image:
      "https://storage.googleapis.com/manumaharani-files-bucket/static/1772469050230-vyom-vibeshot.webp",
    name: "Vyom",
    tagline: "Dining Under the Open Sky",
  },
  {
    description:
      "Rasa is a celebration of taste, artistry, and culinary storytelling. Inspired by the richness of Indian traditions and modern gastronomy, Rasa offers a refined dining experience for the discerning palate.",
    highlights: [
      "Signature Indian and fusion cuisine",
      "Chef-curated menus and seasonal specials",
      "Elegant, intimate dining setting",
      "Focus on presentation, flavors, and storytelling",
    ],
    image:
      "https://storage.googleapis.com/manumaharani-files-bucket/static/1772469040343-Action___Artistry.webp",
    name: "Rasa",
    tagline: "Flavours that Tell a Story",
  },
];

const signatureExperiences = [
  "Riverside Dining: Private meals by the tranquil Kosi River",
  "Candlelight Dinners: Perfect for romantic evenings",
  "Curated Celebrations: Birthdays, anniversaries & special occasions",
  "Nature Breakfasts: Begin your day amidst scenic beauty",
];

export default function FineDiningPage() {
  return (
    <main className="w-full bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[50dvh] md:min-h-[70dvh] lg:min-h-dvh w-full overflow-hidden">
        <Image
          alt="Fine Dining at Manu Maharani"
          className="object-cover"
          fill
          priority
          sizes="100vw"
          src="https://storage.googleapis.com/manumaharani-files-bucket/static/1772469042731-Nivalya_.webp"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80" />
        <div className="absolute inset-0 flex px-4 md:px-8 pb-4 md:pb-8 lg:pb-20 items-end pt-[72px] md:pt-[88px] justify-end">
          <div className="max-w-7xl mx-auto text-white">
            <h1 className="text-2xl md:text-4xl tracking-[0.2em] md:tracking-[0.3em] uppercase text-white leading-tight">
              Al-Fresco Dining & Bar by the Kosi River
            </h1>
          </div>
        </div>
      </section>

      {/* Tagline Section */}
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

      {/* Dining Introduction Section */}
      <section className="w-full bg-[#f8f8f8] py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-4 text-center xl:px-0">
          <div className="mb-6 flex items-center justify-center gap-3">
            <div className="h-[1px] w-12 bg-[#2b2b2b]" />
            <h2 className="font-serif text-3xl font-light tracking-[0.08em] uppercase text-[#2b2b2b] md:text-4xl lg:text-5xl">
              Dining at Manu Maharani Resort & Spa
            </h2>
            <div className="h-[1px] w-12 bg-[#2b2b2b]" />
          </div>
          <h3 className="mb-8 font-serif text-xl tracking-[0.08em] text-[#5a5a5a] md:text-2xl">
            A Culinary Journey in the Heart of the Wilderness
          </h3>
          <p className="font-serif text-base leading-relaxed text-[#5a5a5a] md:text-lg">
            At Manu Maharani Resort & Spa, dining is more than just a meal — it is an experience crafted with flavor,
            ambiance, and nature. Surrounded by lush greenery and the soothing presence of the Kosi River, our culinary
            spaces offer a harmonious blend of global cuisines and regional delicacies.
          </p>
          <p className="mt-4 font-serif text-base leading-relaxed text-[#5a5a5a] md:text-lg">
            From indulgent breakfasts to intimate dinners under the stars, every moment is designed to delight your senses.
          </p>
        </div>
      </section>

      {/* Restaurant Sections */}
      {restaurants.map((restaurant, idx) => (
        <section
          className={`w-full py-16 md:py-24 ${idx % 2 === 0 ? 'bg-white' : 'bg-[#f8f8f8]'}`}
          key={restaurant.name}
        >
          <div className="mx-auto max-w-screen-xl px-4 xl:px-0">
            <div className={`grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-16 items-center ${idx % 2 !== 0 ? 'md:[direction:rtl]' : ''}`}>
              <div className={`relative h-[350px] overflow-hidden md:h-[500px] ${idx % 2 !== 0 ? 'md:[direction:ltr]' : ''}`}>
                <Image
                  alt={restaurant.name}
                  className="object-cover"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  src={restaurant.image}
                />
              </div>
              <div className={idx % 2 !== 0 ? 'md:[direction:ltr]' : ''}>
                <div className="mb-4 flex items-center gap-3">
                  <div className="h-[1px] w-12 bg-[#2b2b2b]" />
                  <h2 className="font-serif text-3xl font-light tracking-[0.08em] uppercase text-[#2b2b2b] md:text-4xl">
                    {restaurant.name}
                  </h2>
                </div>
                <h3 className="mb-6 font-serif text-lg tracking-[0.05em] text-[#5a5a5a] md:text-xl">
                  {restaurant.tagline}
                </h3>
                <p className="mb-6 font-serif text-base leading-relaxed text-[#5a5a5a] md:text-lg">
                  {restaurant.description}
                </p>
                <div>
                  <h4 className="mb-3 font-serif text-sm font-medium tracking-[0.1em] uppercase text-[#2b2b2b]">
                    Highlights
                  </h4>
                  <ul className="space-y-2">
                    {restaurant.highlights.map((highlight) => (
                      <li
                        className="flex items-start gap-2 font-serif text-sm leading-relaxed text-[#5a5a5a] md:text-base"
                        key={highlight}
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#c9a961]" />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Signature Experiences Section */}
      <section className="relative min-h-[600px] w-full overflow-hidden">
        <Image
          alt="Signature Dining Experiences"
          className="object-cover"
          fill
          sizes="100vw"
          src="https://storage.googleapis.com/manumaharani-files-bucket/static/1772469048073-The_Table_Setting.webp"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
        <div className="relative z-10 flex min-h-[600px] items-center">
          <div className="mx-auto max-w-screen-xl px-4 py-16 md:py-24 xl:px-0">
            <div className="max-w-2xl">
              <div className="mb-4 flex items-center gap-3">
                <div className="h-[1px] w-12 bg-white/80" />
                <h2 className="font-serif text-3xl font-light tracking-[0.15em] uppercase text-white md:text-4xl lg:text-5xl">
                  Signature Experiences
                </h2>
              </div>
              <p className="mb-8 font-serif text-base leading-relaxed text-white/90 md:text-lg">
                Enhance your stay with bespoke dining experiences designed to create lasting memories:
              </p>
              <ul className="space-y-3">
                {signatureExperiences.map((experience) => (
                  <li
                    className="flex items-start gap-3 font-serif text-base leading-relaxed text-white/90 md:text-lg"
                    key={experience}
                  >
                    <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#c9a961]" />
                    {experience}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* A Taste of Manu Maharani - Closing Section */}
      <section className="w-full bg-white py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-4 text-center xl:px-0">
          <div className="mb-8 flex items-center justify-center gap-3">
            <div className="h-[1px] w-12 bg-[#2b2b2b]" />
            <h2 className="font-serif text-3xl font-light tracking-[0.15em] uppercase text-[#2b2b2b] md:text-4xl lg:text-5xl">
              A Taste of Manu Maharani
            </h2>
            <div className="h-[1px] w-12 bg-[#2b2b2b]" />
          </div>
          <p className="font-serif text-base leading-relaxed text-[#5a5a5a] md:text-lg">
            Every dish at Manu Maharani is a reflection of our philosophy — to combine authentic flavors with warm
            hospitality. Whether you seek indulgence, comfort, or a fine dining escape, our restaurants promise an
            experience that lingers long after your meal.
          </p>
        </div>
      </section>
    </main>
  );
}
