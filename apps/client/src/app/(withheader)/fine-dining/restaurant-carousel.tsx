"use client";

import Image from "next/image";
import React, { useCallback, useRef, useState } from "react";

const restaurants = [
  {
    description:
      "Nivalaya is our all-day dining restaurant, offering a vibrant spread of global and Indian cuisines in a warm, welcoming setting. Perfect for families and groups, it brings together rich flavors and comforting classics.",
    image:
      "https://storage.googleapis.com/manumaharani-files-bucket/static/1772469042731-Nivalya_.webp",
    name: "Nivalaya",
  },
  {
    description:
      "Vyom offers a magical open-air dining experience, where the sky becomes your ceiling. Whether it's a romantic dinner or a relaxed evening with friends, Vyom creates unforgettable moments under the stars.",
    image:
      "https://storage.googleapis.com/manumaharani-files-bucket/static/1772469050230-vyom-vibeshot.webp",
    name: "Vyom",
  },
  {
    description:
      "Rasa is a celebration of taste, artistry, and culinary storytelling. Inspired by the richness of Indian traditions and modern gastronomy, Rasa offers a refined dining experience for the discerning palate.",
    image:
      "https://storage.googleapis.com/manumaharani-files-bucket/static/1772469040343-Action___Artistry.webp",
    name: "Rasa",
  },
];

// Clone items at both ends for seamless infinite loop
const CLONE_COUNT = 2;
const extendedItems = [
  ...restaurants.slice(-CLONE_COUNT),
  ...restaurants,
  ...restaurants.slice(0, CLONE_COUNT),
];

export function RestaurantCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [animate, setAnimate] = useState(true);
  const trackRef = useRef<HTMLDivElement>(null);

  // Offset by CLONE_COUNT because of prepended clones
  const displayIndex = currentIndex + CLONE_COUNT;

  const next = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setAnimate(true);
    setCurrentIndex((prev) => prev + 1);
  }, [isTransitioning]);

  const prev = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setAnimate(true);
    setCurrentIndex((prev) => prev - 1);
  }, [isTransitioning]);

  const handleTransitionEnd = useCallback(() => {
    setIsTransitioning(false);

    let newIndex = currentIndex;
    if (currentIndex >= restaurants.length) {
      newIndex = currentIndex - restaurants.length;
    } else if (currentIndex < 0) {
      newIndex = currentIndex + restaurants.length;
    }

    if (newIndex !== currentIndex) {
      // Instantly jump to the real position without animation
      setAnimate(false);
      setCurrentIndex(newIndex);
      requestAnimationFrame(() => {
        setAnimate(true);
      });
    }
  }, [currentIndex]);

  return (
    // --slide-size: 100% on mobile (1 visible), 50% on md+ (2 visible)
    <div className="relative [--slide-size:100%] md:[--slide-size:50%]">
      <button
        aria-label="Previous restaurant"
        className="absolute left-0 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-xl text-[#2b2b2b] shadow-lg transition-all hover:bg-[#f8f8f8] md:h-12 md:w-12 md:text-2xl"
        onClick={prev}
      >
        ‹
      </button>
      <button
        aria-label="Next restaurant"
        className="absolute right-0 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-xl text-[#2b2b2b] shadow-lg transition-all hover:bg-[#f8f8f8] md:h-12 md:w-12 md:text-2xl"
        onClick={next}
      >
        ›
      </button>

      <div className="overflow-hidden px-8 md:px-14">
        <div
          className="flex"
          onTransitionEnd={handleTransitionEnd}
          ref={trackRef}
          style={{
            transform: `translateX(calc(-${displayIndex} * var(--slide-size)))`,
            transition: animate ? "transform 500ms ease-in-out" : "none",
          }}
        >
          {extendedItems.map((restaurant, idx) => (
            <div
              className="w-full flex-shrink-0 px-2 md:w-1/2 md:px-4"
              key={idx}
            >
              <div className="bg-white shadow-sm">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    alt={restaurant.name}
                    className="object-cover transition-transform duration-500 hover:scale-105"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    src={restaurant.image}
                  />
                </div>
                <div className="p-6 md:p-8">
                  <h3 className="mb-3 font-serif text-xl font-light tracking-[0.08em] uppercase text-[#2b2b2b] md:mb-4 md:text-2xl">
                    {restaurant.name}
                  </h3>
                  <p className="mb-4 font-serif text-sm leading-relaxed text-[#5a5a5a] md:mb-6">
                    {restaurant.description}
                  </p>
                  <a
                    className="inline-flex items-center justify-center bg-[#2b2b2b] px-6 py-3 font-serif text-xs tracking-[0.15em] uppercase text-white transition-all hover:bg-[#c9a961] min-h-[44px]"
                    href="#book"
                  >
                    Book a Table
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
