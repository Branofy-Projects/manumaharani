"use client";

import Image from "next/image";
import React, { useCallback, useRef, useState } from "react";

const restaurants = [
  {
    description:
      "LOYA takes its diners on a gastronomic journey through North India's diverse landscape, blending flavours from the Himalayan foothills to the vibrant streets of Delhi.",
    image:
      "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=1600&auto=format&fit=crop",
    name: "Nivalaya",
  },
  {
    description:
      "From its first location at The Taj Mahal Palace, Mumbai, Golden Dragon has introduced guests to rarefied, divine experiences that transcend mere dining.",
    image:
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1600&auto=format&fit=crop",
    name: "Vyom",
  },
  {
    description:
      "Experience the artistry of Japanese cuisine with the finest ingredients, masterful techniques and an unwavering commitment to authenticity.",
    image:
      "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?q=80&w=1600&auto=format&fit=crop",
    name: "Rasa",
  },
  {
    description:
      "Experience the artistry of Japanese cuisine with the finest ingredients, masterful techniques and an unwavering commitment to authenticity.",
    image:
      "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?q=80&w=1600&auto=format&fit=crop",
    name: "Discotheque",
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
                  <button className="inline-flex items-center gap-2 font-serif text-sm tracking-[0.08em] uppercase text-[#c9a961] transition-all hover:gap-3">
                    More
                    <span className="text-lg">›</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
