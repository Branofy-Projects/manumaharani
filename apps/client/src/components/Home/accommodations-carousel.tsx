"use client";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import React, { useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/utils";

import { Button } from "../ui/button";

interface Accommodation {
  description: string;
  image: string;
  title: string;
}

const accommodations: Accommodation[] = [
  {
    description:
      "Drink in warm sunshine and fresh breezes from your private balcony, which looks out to the best backyard in Austin: our manicured lawns, verdant gardens and Lady Bird Lake.",
    image:
      "https://www.manumaharaniresorts.com/wp-content/uploads/2025/01/mm-executive-room.webp",
    title: "Signature Stays",
  },
  {
    description:
      "Evenings spent on your expansive wraparound deck, with firepits lending a glow to the lake views, are experiences you'll remember for a lifetime.",
    image:
      "https://www.manumaharaniresorts.com/wp-content/uploads/2024/04/romantic-getaway-1.webp",
    title: "Weddings",
  },
  {
    description:
      "This pied-à-terre is perfectly suited to city living, with views down buzzy San Jacinto Boulevard, Austin-inspired art around you and plenty of space to put your feet up.",
    image:
      "https://www.manumaharaniresorts.com/wp-content/uploads/2022/10/pexels-pixabay-533325-scaled-1024x654.jpg",
    title: "Fine Dining",
  },
  {
    description:
      "Your fully equipped residence, this suite provides space to spare, with balcony breezes filtering in and a service kitchen for hosting dinners or fixing midnight snacks.",
    image:
      "https://www.manumaharaniresorts.com/wp-content/uploads/2022/09/DSC_9880-scaled-2048x1366.jpg",
    title: "Corporate & MICE",
  },
  {
    description:
      "Bring the kids or a group of friends: This flexible suite can sleep up to five people in perfect comfort, thanks to two full bathrooms and separate living and sleeping areas.",
    image:
      "https://www.manumaharaniresorts.com/wp-content/uploads/2025/01/mm-executive-room.webp",
    title: "Safari",
  },
];

const CLONE_COUNT = 5;
const ANIMATION_DURATION = 500;

export default function AccommodationsCarousel() {
  const [index, setIndex] = useState(accommodations.length);
  const [isAnimating, setIsAnimating] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const total = accommodations.length;
  const clones = getClones(accommodations, CLONE_COUNT);
  const totalCards = clones.length;

  useEffect(() => {
    function updateWidth() {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    }
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const dims = useMemo(() => getCardDimensions(containerWidth), [containerWidth]);

  // Center the active card in the container
  const translateX =
    containerWidth / 2 - dims.cardWidthActive / 2 - index * (dims.cardWidth + dims.gap);

  const goTo = (newIdx: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIndex(newIdx);
  };

  const goLeft = () => goTo(index - 1);
  const goRight = () => goTo(index + 1);

  // Seamless infinite loop: after animation, silently jump index back into the real range
  useEffect(() => {
    if (!isAnimating) return;
    const handle = setTimeout(() => {
      setIsAnimating(false);
      if (index < CLONE_COUNT) {
        setIndex(total + index);
      } else if (index >= total + CLONE_COUNT) {
        setIndex(index - total);
      }
    }, ANIMATION_DURATION);
    return () => clearTimeout(handle);
  }, [isAnimating, index, total]);

  const centerIdx = (((index - CLONE_COUNT) % total) + total) % total;

  return (
    <section className="py-16 md:py-24 w-full bg-white">
      <h2 className="text-2xl self-center w-full text-center md:text-3xl font-thin tracking-widest uppercase text-ceter mb-12 md:mb-16">
        Accommodations
      </h2>

      {/* Carousel viewport */}
      <div
        className="w-full overflow-hidden"
        ref={containerRef}
        style={{ height: dims.cardHeightActive }}
      >
        <div
          className="flex items-center"
          style={{
            gap: dims.gap,
            height: dims.cardHeightActive,
            transform: `translateX(${translateX}px)`,
            transition: isAnimating
              ? `transform ${ANIMATION_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)`
              : "none",
            width: totalCards * (dims.cardWidth + dims.gap),
          }}
        >
          {clones.map((card, i) => {
            const isActive = i === index;
            const cardHeight = isActive
              ? dims.cardHeightActive
              : dims.cardHeightInactive;
            const cardW = isActive ? dims.cardWidthActive : dims.cardWidth;

            return (
              <div
                className="shrink-0 relative bg-white border border-gray-300"
                key={i + card.title}
                style={{
                  height: cardHeight,
                  transition: `height ${ANIMATION_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1), width ${ANIMATION_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)`,
                  width: cardW,
                }}
              >
                {/* Background image fills the card */}
                <div className="absolute inset-0">
                  <Image
                    alt={card.title}
                    className="object-cover"
                    fill
                    sizes={`${dims.cardWidthActive}px`}
                    src={card.image}
                  />
                </div>

                {/* Content body at the bottom */}
                <div
                  className="absolute bottom-0 left-0 right-0 bg-white flex flex-col items-center px-4 md:px-5"
                  style={{
                    paddingBottom: isActive ? 20 : 12,
                    paddingTop: isActive ? 20 : 12,
                    transition: `padding ${ANIMATION_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)`,
                  }}
                >
                  {/* Title */}
                  <h3 className="text-[10px] md:text-xs font-bold tracking-[0.2em] text-black uppercase text-center leading-tight">
                    {card.title}
                  </h3>

                  {/* Separator + Description + Buttons (animated height) */}
                  <div
                    className="w-full flex flex-col items-center overflow-hidden"
                    style={{
                      maxHeight: isActive ? 300 : 0,
                      opacity: isActive ? 1 : 0,
                      transition: `max-height ${ANIMATION_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1), opacity ${ANIMATION_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)`,
                    }}
                  >
                    <div className="w-10 border-t border-black mt-3 mb-3 md:mt-4 md:mb-4" />
                    <p className="text-gray-600 text-xs md:text-sm text-center leading-relaxed mb-4 md:mb-6 px-1">
                      {card.description}
                    </p>
                    <div className="flex gap-2 md:gap-3">
                      <Button variant="reserve">
                        Check Rates
                      </Button>
                      <Button variant="outline">
                        Details
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-center gap-6 mt-6 md:mt-8 select-none">
        <button
          aria-label="Previous slide"
          className="p-1 hover:opacity-70 transition-opacity"
          onClick={goLeft}
        >
          <ChevronLeftIcon className="w-5 h-5 text-black" />
        </button>
        <span className="text-xs font-bold tracking-[0.2em] uppercase">
          {centerIdx + 1}
          <span className="mx-2 font-normal">/</span>
          {total}
        </span>
        <button
          aria-label="Next slide"
          className="p-1 hover:opacity-70 transition-opacity"
          onClick={goRight}
        >
          <ChevronRightIcon className="w-5 h-5 text-black" />
        </button>
      </div>
    </section >
  );
}

/** Derive all card dimensions from the container width */
function getCardDimensions(containerWidth: number) {
  let cardWidth: number;
  let gap: number;

  if (containerWidth < 480) {
    cardWidth = containerWidth * 0.6;
    gap = 12;
  } else if (containerWidth < 768) {
    cardWidth = containerWidth * 0.45;
    gap = 16;
  } else if (containerWidth < 1024) {
    cardWidth = containerWidth * 0.3;
    gap = 18;
  } else {
    cardWidth = Math.min(containerWidth * 0.22, 320);
    gap = 20;
  }

  cardWidth = Math.round(cardWidth);
  const cardWidthActive = Math.round(cardWidth * 1.18);
  const cardHeightInactive = Math.round(cardWidth * 1.39);
  const cardHeightActive = Math.round(cardWidth * 1.76);

  return { cardHeightActive, cardHeightInactive, cardWidth, cardWidthActive, gap };
}

function getClones(list: Accommodation[], count: number): Accommodation[] {
  return [...list.slice(-count), ...list, ...list.slice(0, count)];
}
