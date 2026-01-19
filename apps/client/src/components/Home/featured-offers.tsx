import Image from "next/image";
import React from "react";

const offers = [
  {
    image:
      "https://images.unsplash.com/photo-1710330758934-865ce4e4f298?auto=format&fit=crop&w=600&q=80",
    link: "#",
    subtitle:
      "Immerse yourself in our crystal-clear pool, a verdant oasis designed for post-safari rejuvenation. Surrounded by tropical greenery, it is the perfect spot for families to gather and unwind under the Corbett sun.",
    title: "Outdoor Swimming Pool",
  },
  {
    image:
      "https://plus.unsplash.com/premium_photo-1664193968850-ee8f7ca24e6d?auto=format&fit=crop&w=600&q=80",
    link: "#",
    subtitle:
      "Balance productivity with peace. Our high-speed Wi-Fi and quiet riverside corners allow you to stay connected to the world while your soul remains firmly planted in nature.",
    title: "Executive Work-From-Anywhere Suites",
  },
  {
    image:
      "https://images.unsplash.com/photo-1596997000103-e597b3ca50df?auto=format&fit=crop&w=600&q=80",
    link: "#",
    subtitle:
      "An indoor & outdoor playground with slides, climbers and swings.",
    title: "Kids’ Playground",
  },
  {
    image:
      "https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=600&q=80",
    link: "#",
    subtitle: "Please consider your private parking or better yet.",
    title: "Interactive Kids’ Play Zone",
  },
];
export default function FeaturedOffers() {
  return (
    <section className="flex w-full max-w-screen-xl mx-auto flex-col items-center py-10 md:py-20">
      <div className="w-full  items-center md:justify-between mb-8 md:mb-12 px-2 md:px-0 gap-4 md:gap-0">
        <h2
          className="text-3xl md:text-4xl font-thin tracking-widest uppercase mb-4 text-center"
          style={{ color: "#000000" }}
        >
          World-Class Amenities for the Modern Explorer
        </h2>
      </div>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-2 px-4 xl:px-0">
        {offers.map((offer, idx) => (
          <div
            className="relative group overflow-hidden shadow-lg min-h-[260px] md:min-h-[400px] flex flex-col justify-end rounded-lg"
            key={idx}
          >
            <Image
              alt={offer.title}
              className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
              fill
              src={offer.image}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
            <div className="relative z-20 p-3 md:p-4 flex flex-col gap-2">
              <h3 className="text-white text-base md:text-sm font-bold tracking-widest mb-2 uppercase leading-tight">
                {offer.title}
              </h3>
              {offer.subtitle && (
                <p className="text-white/80 text-xs md:text-sm mb-2">
                  {offer.subtitle}
                </p>
              )}
              <a
                className="text-white text-xs md:text-[0.5rem] font-semibold tracking-widest border-white pb-1 hover:text-white/70 transition-all uppercase"
                href={offer.link}
              >
                View Details
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
