"use client";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

interface Accommodation {
  description: string;
  image: string;
  subtitle?: string;
  title: string;
}

const accommodations: Accommodation[] = [
  {
    description:
      "Plan guided safaris to the Bijrani and Dhikala zones with assistance from the resort team, who help with timings, permits, and briefings.",
    image: "",
    title: "Jungle Safaris & Wildlife",
  },
  {
    description:
      "Enjoy peaceful walks along the Kosi and cosy evenings with bonfires on select days, depending on season and weather.",
    image: "",
    title: "Riverside Walks & Bonfires",
  },
  {
    description:
      "Use the wide open spaces for informal games, picnics, or simply lounging together between activities.",
    image: "",
    title: "Family Time on the Lawns",
  },
  {
    description:
      "Combine meetings or training sessions with team‑building activities, theme dinners, and downtime in nature, all supported by the resort’s events team.",
    image: "",
    title: "Corporate & Social Events",
  },
  {
    description:
      "Modern, spacious rooms ideal for couples or small families who want extra space to spread out. Large beds, elegant bathrooms, and soothing interiors create a comfortable base between safaris and pool time.",
    image:
      "https://www.manumaharaniresorts.com/wp-content/uploads/2025/01/mm-executive-room.webp",
    title: "Executive Room",
  },
  {
    description:
      "Add an indulgent touch to your stay with a private in‑room Jacuzzi after a long day in the forest. This category is perfect for couples and families who enjoy a little extra pampering.",
    image:
      "https://www.manumaharaniresorts.com/wp-content/uploads/2025/01/mm-executive-room-jaccuzi.webp",
    title: "Executive Room with Jacuzzi",
  },
  {
    description:
      "Independent, cottage‑style units with a cosy layout and easy access to lawns and pathways. Ideal for couples or solo travellers who prefer a more private",
    image:
      "https://www.manumaharaniresorts.com/wp-content/uploads/2022/04/MOK_9989.webp",
    title: "Luxury Cottage",
  },
  {
    description:
      "Larger cottage units with extra space and seating, well‑suited for small families or friends travelling together. Step out directly onto green spaces and enjoy quiet mornings with tea outdoors.",
    image:
      "https://www.manumaharaniresorts.com/wp-content/uploads/2022/10/DAP06598.webp",
    title: "Club Cottage",
  },

  {
    description:
      "Generous multi‑bed rooms designed for big families and groups who want to stay together comfortably. Ample floor space and flexible bedding make these ideal for extended stays and celebrations.",
    image:
      "https://www.manumaharaniresorts.com/wp-content/uploads/2022/11/MOK_0024-HDR.webp",
    title: "Family Room",
  },
  {
    description:
      "A smart, value‑forward choice for couples and small families looking for a refined stay at a luxury resort in Jim Corbett without stretching the TbBuildingEstate.",
    image:
      "https://www.manumaharaniresorts.com/wp-content/uploads/2022/11/MOK_0024-HDR.webp",
    title: "Deluxe Room",
  },
];

const VISIBLE_CARDS = 5;
const CARD_WIDTH =
  typeof window !== "undefined" && window.innerWidth < 640 ? 240 : 320;
const GAP = 24;
const ANIMATION_DURATION = 500;

export default function AccommodationsCarousel() {
  const [index, setIndex] = useState(accommodations.length); // Start at first real card
  const [isAnimating, setIsAnimating] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const total = accommodations.length;
  const clones = getClones(accommodations, VISIBLE_CARDS);
  const totalCards = clones.length;

  // Update container width on mount and resize
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

  // Center the active card based on container width
  const translateX =
    containerWidth / 2 - CARD_WIDTH / 1.6 - index * (CARD_WIDTH + GAP);

  // Navigation
  const goTo = (newIdx: number) => {
    setIsAnimating(true);
    setIndex(newIdx);
  };

  const goLeft = () => {
    if (isAnimating) return;
    goTo(index - 1);
  };
  const goRight = () => {
    if (isAnimating) return;
    goTo(index + 1);
  };

  // Handle jump after animation for seamless infinite effect
  useEffect(() => {
    if (!isAnimating) return;
    const handle = setTimeout(() => {
      setIsAnimating(false);
      if (index < VISIBLE_CARDS) {
        setIndex(total + index);
      } else if (index >= total + VISIBLE_CARDS) {
        setIndex(index - total);
      }
    }, ANIMATION_DURATION);
    return () => clearTimeout(handle);
  }, [isAnimating, index, total]);

  // Calculate center index for display
  const centerIdx = (((index - VISIBLE_CARDS) % total) + total) % total;

  return (
    <section className="w-full py-24">
      <div className="max-w-screen-xl mx-auto">
        <h2
          className="text-3xl md:text-4xl font-thin tracking-widest uppercase mb-4 text-center px-4 xl:px-0"
          style={{ color: "#000000" }}
        >
          Rooms & Experiences
        </h2>
        <p className="text-gray-700 text-base font-serif mb-8 md:mb-12 text-center px-4 xl:px-0">
          Stay close to the river, explore the forest, or simply slow down on
          the lawns—your time here can be as active or as easy as you like.
        </p>
        {/* Carousel Row */}
        <div
          className="overflow-hidden h-full w-full px-2 sm:px-4 md:px-12 "
          ref={containerRef}
        >
          <div
            className="flex items-center"
            style={{
              columnGap: GAP,
              transform: `translateX(${translateX}px)`,
              transition: isAnimating
                ? `transform ${ANIMATION_DURATION}ms cubic-bezier(0.4,0,0.2,1)`
                : "none",
              width: `${totalCards * (CARD_WIDTH + GAP)}px`,
            }}
          >
            {clones.map((card, i) => {
              const offset = i - index;
              const isCenter = offset === 0;
              return (
                <div
                  className={`bg-white border border-gray-200 flex flex-col items-center justify-start
                    ${isCenter ? "shadow-2xl z-20" : "opacity-80 z-10"}
                  `}
                  key={i + card.title}
                  style={{
                    boxShadow: isCenter
                      ? "0 8px 32px rgba(0,0,0,0.12)"
                      : undefined,
                    marginLeft: i === 0 ? 0 : 0,
                    maxWidth: CARD_WIDTH,
                    minWidth: CARD_WIDTH,
                    transform: isCenter ? "scale(1.05)" : "scale(1)",
                  }}
                >
                  <Image
                    alt={card.title}
                    className={`w-full object-cover ${isCenter ? "h-48" : "h-60"
                      }`}
                    height={300}
                    src={card.image}
                    width={400}
                  />
                  <div className="flex flex-col items-center px-6 py-6 w-full">
                    <h3
                      className={`text-center font-semibold tracking-widest text-black mb-2 ${isCenter ? "text-lg" : "text-base"
                        }`}
                    >
                      {card.title}
                    </h3>

                    <div
                      className={cn(
                        "transition-all duration-500",
                        `${isCenter ? "opacity-100 h-auto" : "opacity-0 h-0"}`
                      )}
                    >
                      <div className="w-12 border-t border-gray-300 my-3" />
                      <p className="text-gray-600 text-sm text-center mb-6 min-h-[72px]">
                        {card?.subtitle && card.subtitle}
                        {card.subtitle && <br />}
                        {card.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {/* Navigation Bar Below Carousel */}
      <div className="flex items-center justify-center gap-4 md:gap-8 mt-4 md:mt-8 select-none">
        <button
          aria-label="Previous"
          className="p-2 rounded-full transition-transform duration-200 hover:scale-125 hover:bg-gray-100"
          onClick={goLeft}
        >
          <ChevronLeftIcon className="w-8 h-8 text-black" />
        </button>
        <span className="text-xl font-semibold">
          {centerIdx + 1} <span className="mx-1 text-lg font-normal">/</span>{" "}
          {total}
        </span>
        <button
          aria-label="Next"
          className="p-2 rounded-full transition-transform duration-200 hover:scale-125 hover:bg-gray-100"
          onClick={goRight}
        >
          <ChevronRightIcon className="w-8 h-8 text-black" />
        </button>
      </div>
      <button className="mx-auto block mt-8 border border-black px-6 md:px-8 py-2 md:py-3 text-black tracking-widest font-medium uppercase text-xs md:text-base hover:bg-black hover:text-white transition">
        Explore All Rooms
      </button>
    </section>
  );
}

function getClones(list: Accommodation[], visible: number): Accommodation[] {
  return [...list.slice(-visible), ...list, ...list.slice(0, visible)];
}
