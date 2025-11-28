"use client";

import Image from 'next/image';
import React, { useState } from 'react';

const attractions = [
  {
    image:
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=600&q=80",
    link: "#",
    subtitle:
      "Experience the wilderness and spot tigers, elephants, and exotic birds in their natural habitat.",
    title: "Jim Corbett National Park",
  },
  {
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=80",
    link: "#",
    subtitle:
      "Scenic lake perfect for boating and enjoying breathtaking mountain views.",
    title: "Bhimtal Lake",
  },
  {
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=80",
    link: "#",
    subtitle:
      "A beautiful hill station known for its panoramic views of the Himalayas.",
    title: "Nainital",
  },
  {
    image:
      "https://images.unsplash.com/photo-1571847141223-0f9a3d1c2c5e?auto=format&fit=crop&w=600&q=80",
    link: "#",
    subtitle:
      "Ancient temples and spiritual sites nestled in the serene mountains.",
    title: "Jageshwar Temples",
  },
  {
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=80",
    link: "#",
    subtitle:
      "Adventure activities including river rafting, trekking, and camping.",
    title: "Kosi River",
  },
  {
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=80",
    link: "#",
    subtitle:
      "Picturesque village offering stunning views and peaceful surroundings.",
    title: "Mukteshwar",
  },
];

export default function NearbyAttractions() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? attractions.length - 2 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= attractions.length - 2 ? 0 : prev + 1));
  };

  return (
    <section className="flex w-full flex-col items-center py-10 md:py-20">
      <div className="mx-auto mb-8 flex w-full max-w-screen-xl flex-col items-center gap-4 px-2 md:mb-12 md:flex-row md:justify-between md:gap-0 md:px-0">
        <h2
          className="text-lg font-light uppercase tracking-widest md:text-3xl"
          style={{ color: "#000000" }}
        >
          Nearby Attractions
        </h2>
        <a
          className="border-b-2 border-black pb-1 text-xs font-semibold uppercase tracking-widest text-black transition-all hover:text-gray-600 md:text-sm"
          href="#"
        >
          View All
        </a>
      </div>

      {/* Desktop: Scrollable carousel with 2 items */}
      <div className="relative mx-auto hidden w-full max-w-screen-xl md:block md:px-0">
        <button
          aria-label="Previous"
          className="absolute -left-6 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white text-2xl text-black shadow-lg transition-all hover:bg-gray-100"
          onClick={handlePrev}
          type="button"
        >
          ‹
        </button>
        <button
          aria-label="Next"
          className="absolute -right-6 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white text-2xl text-black shadow-lg transition-all hover:bg-gray-100"
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
                    src={attraction.image}
                  />
                  <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="relative z-20 flex flex-col gap-2 p-4">
                    <h3 className="mb-2 text-sm font-bold uppercase leading-tight tracking-widest text-white">
                      {attraction.title}
                    </h3>
                    {attraction.subtitle && (
                      <p className="mb-2 text-sm text-white/80">
                        {attraction.subtitle}
                      </p>
                    )}
                    <a
                      className="pb-1 text-[0.5rem] font-semibold uppercase tracking-widest text-white transition-all hover:text-white/70"
                      href={attraction.link}
                    >
                      View Details
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile: Grid layout */}
      <div className="mx-auto grid w-full max-w-screen-xl grid-cols-1 gap-4 px-2 sm:grid-cols-2 md:hidden md:px-0">
        {attractions.map((attraction, idx) => (
          <div
            className="group relative flex min-h-[260px] flex-col justify-end overflow-hidden rounded-lg shadow-lg"
            key={idx}
          >
            <Image
              alt={attraction.title}
              className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
              fill
              src={attraction.image}
            />
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="relative z-20 flex flex-col gap-2 p-3">
              <h3 className="mb-2 text-base font-bold uppercase leading-tight tracking-widest text-white">
                {attraction.title}
              </h3>
              {attraction.subtitle && (
                <p className="mb-2 text-xs text-white/80">
                  {attraction.subtitle}
                </p>
              )}
              <a
                className="pb-1 text-xs font-semibold uppercase tracking-widest text-white transition-all hover:text-white/70"
                href={attraction.link}
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
