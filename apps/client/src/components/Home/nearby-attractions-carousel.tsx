"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import type { TAttraction } from "@repo/db";

type Props = {
  attractions: TAttraction[];
};

export function NearbyAttractionsCarousel({ attractions }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? Math.max(0, attractions.length - 2) : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= attractions.length - 2 ? 0 : prev + 1));
  };

  return (
    <>
      {/* Desktop: Scrollable carousel with 2 items */}
      <div className="relative mx-auto hidden w-full max-w-screen-xl md:block px-4 xl:px-0">
        <button
          aria-label="Previous"
          className="absolute left-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white text-2xl text-black shadow-lg transition-all hover:bg-gray-100"
          onClick={handlePrev}
          type="button"
        >
          &#8249;
        </button>
        <button
          aria-label="Next"
          className="absolute right-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white text-2xl text-black shadow-lg transition-all hover:bg-gray-100"
          onClick={handleNext}
          type="button"
        >
          &#8250;
        </button>

        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * 50}%)`,
            }}
          >
            {attractions.map((attraction, idx) => (
              <div className="w-1/2 flex-shrink-0 px-2" key={idx}>
                <Link className="group relative flex min-h-[400px] flex-col justify-end overflow-hidden rounded-lg shadow-lg" href={`/nearby-attractions/${attraction.slug}`}>
                  <Image
                    alt={attraction.title}
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    fill
                    loading="lazy"
                    sizes="50vw"
                    src={attraction.image?.large_url || attraction.image?.original_url || "/placeholder.jpg"}
                  />
                  <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="relative z-20 flex flex-col gap-2 p-4">
                    <h3 className="mb-2 text-sm font-bold uppercase leading-tight tracking-widest text-white">
                      {attraction.title}
                    </h3>
                    {attraction.subtitle && (
                      <p className="mb-2 text-sm text-white/80 line-clamp-2">
                        {attraction.subtitle}
                      </p>
                    )}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile: Grid layout */}
      <div className="mx-auto grid w-full max-w-screen-xl grid-cols-1 gap-4 px-4 sm:grid-cols-2 md:hidden xl:px-0">
        {attractions.map((attraction, idx) => (
          <Link
            className="group relative flex min-h-[260px] flex-col justify-end overflow-hidden rounded-lg shadow-lg"
            href={`/nearby-attractions/${attraction.slug}`}
            key={idx}
          >
            <Image
              alt={attraction.title}
              className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
              fill
              loading="lazy"
              sizes="(max-width: 640px) 100vw, 50vw"
              src={attraction.image?.large_url || attraction.image?.original_url || "/placeholder.jpg"}
            />
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="relative z-20 flex flex-col gap-2 p-3">
              <h3 className="mb-2 text-base font-bold uppercase leading-tight tracking-widest text-white">
                {attraction.title}
              </h3>
              {attraction.subtitle && (
                <p className="mb-2 text-xs text-white/80 line-clamp-2">
                  {attraction.subtitle}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
