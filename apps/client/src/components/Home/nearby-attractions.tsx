"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { getAttractions } from "@repo/actions";
import type { TAttraction } from "@repo/db";

export default function NearbyAttractions() {
  const [attractions, setAttractions] = useState<TAttraction[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchAttractions = async () => {
      try {
        const data = await getAttractions(true); // Fetch active only
        setAttractions(data);
      } catch (error) {
        console.error("Error fetching attractions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAttractions();
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? Math.max(0, attractions.length - 2) : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= attractions.length - 2 ? 0 : prev + 1));
  };

  if (loading) {
    return (
      <section className="flex w-full flex-col items-center py-10 md:py-20 lg:min-h-[600px]">
        <div className="animate-pulse flex flex-col items-center w-full">
          <div className="h-10 w-48 bg-gray-200 mb-4 rounded" />
          <div className="h-6 w-96 bg-gray-200 mb-12 rounded" />
          <div className="flex gap-4 w-full max-w-screen-xl px-4">
             <div className="w-1/2 h-[400px] bg-gray-200 rounded-lg" />
             <div className="w-1/2 h-[400px] bg-gray-200 rounded-lg" />
          </div>
        </div>
      </section>
    );
  }

  if (attractions.length === 0) return null;

  return (
    <section className="flex w-full flex-col items-center py-10 md:py-20">
      <h2
        className="text-3xl md:text-4xl font-thin tracking-widest uppercase mb-4 text-center px-4 xl:px-0"
        style={{ color: "#000000" }}
      >
        Nearby
      </h2>
      <p className="text-gray-700 text-base font-serif mb-8 md:mb-12 text-center px-4 xl:px-0">
        Extend your stay to discover lakes, hill towns, temples, and viewpoints
        around Corbett, all within comfortable driving distance from Manu
        Maharani.
      </p>

      {/* Desktop: Scrollable carousel with 2 items */}
      <div className="relative mx-auto hidden w-full max-w-screen-xl md:block px-4 xl:px-0">
        <button
          aria-label="Previous"
          className="absolute left-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white text-2xl text-black shadow-lg transition-all hover:bg-gray-100"
          onClick={handlePrev}
          type="button"
        >
          ‹
        </button>
        <button
          aria-label="Next"
          className="absolute right-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white text-2xl text-black shadow-lg transition-all hover:bg-gray-100"
          onClick={handleNext}
          type="button"
        >
          ›
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
                <div className="group relative flex min-h-[400px] flex-col justify-end overflow-hidden rounded-lg shadow-lg">
                  <Image
                    alt={attraction.title}
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    fill
                    src={attraction.image?.url || "/placeholder.jpg"}
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
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile: Grid layout */}
      <div className="mx-auto grid w-full max-w-screen-xl grid-cols-1 gap-4 px-4 sm:grid-cols-2 md:hidden xl:px-0">
        {attractions.map((attraction, idx) => (
          <div
            className="group relative flex min-h-[260px] flex-col justify-end overflow-hidden rounded-lg shadow-lg"
            key={idx}
          >
            <Image
              alt={attraction.title}
              className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
              fill
              src={attraction.image?.url || "/placeholder.jpg"}
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
              {attraction.link && attraction.link !== "#" && (
                <a
                  className="pb-1 text-xs font-semibold uppercase tracking-widest text-white transition-all hover:text-white/70"
                  href={attraction.link}
                >
                  View Details
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
