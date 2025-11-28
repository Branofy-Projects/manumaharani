"use client";

import {
  ClockIcon,
  FaceSmileIcon,
  TruckIcon,
  WifiIcon,
} from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import React from "react";

// Custom icons for specific amenities where Heroicons might not have a perfect match
// Using SVG paths for a consistent look with Heroicons
const PoolIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
  </svg>
);

const FoodIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M18.06 22.99h1.66c.84 0 1.53-.64 1.63-1.46L23 5.05h-5V22.99zM12 15.5c-3.03 0-5.5-2.47-5.5-5.5s2.47-5.5 5.5-5.5 5.5 2.47 5.5 5.5-2.47 5.5-5.5 5.5zm0-9c-1.93 0-3.5 1.57-3.5 3.5s1.57 3.5 3.5 3.5 3.5-1.57 3.5-3.5-1.57-3.5-3.5-3.5z" />
    <path d="M6 22.99h1.66c.84 0 1.53-.64 1.63-1.46L11 5.05H6V22.99z" />
    <path d="M1 22.99h1.66c.84 0 1.53-.64 1.63-1.46L6 5.05H1V22.99z" />
  </svg>
);

const amenities = [
  {
    description:
      "Upgrading your bandwidth is easy, and it can be done right from your phone.",
    icon: WifiIcon,
    title: "High Speed Wifi",
  },
  {
    description:
      "With our service you may enjoy the finest life in our resort.",
    icon: ClockIcon,
    title: "Reservations 24/7",
  },
  {
    description: "We have the fuel to start your day right.",
    icon: FoodIcon,
    title: "Breakfast Included",
  },
  {
    description:
      "Our big-sized swimming pool, conveniently located in an adjacent clubhouse.",
    icon: PoolIcon,
    title: "Outdoor Swimming Pool",
  },
  {
    description:
      "An indoor & outdoor playground with slides, climbers and swings.",
    icon: FaceSmileIcon,
    title: "Kids' Playground",
  },
  {
    description: "Please consider your private parking or better yet.",
    icon: TruckIcon,
    title: "Parking Space",
  },
];

export default function AboutUsPage() {
  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[#faf6f1] pt-[72px] md:pt-[88px]">
      {/* Hero Section */}
      <section className="relative h-[50vh] w-full md:h-[60vh]">
        <Image
          alt="Manu Maharani Resort & Spa"
          className="object-cover"
          fill
          priority
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2000&auto=format&fit=crop"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
          <h1 className="text-4xl font-thin uppercase tracking-[0.2em] md:text-6xl">
            About Us
          </h1>
          <div className="mt-4 h-px w-24 bg-white/80" />
          <p className="mt-4 max-w-2xl px-4 font-serif text-lg italic text-white/90 md:text-xl">
            Discover the oasis of tranquility in the lap of wilderness
          </p>
        </div>
      </section>

      {/* Introduction Content */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:py-24">
        <div className="grid gap-12 md:grid-cols-2 md:gap-20">
          {/* Left: Image Grid */}
          <div className="relative grid grid-cols-2 gap-4">
            <div className="relative mt-12 aspect-[3/4] w-full overflow-hidden rounded-lg">
              <Image
                alt="Resort Exterior"
                className="object-cover transition-transform duration-700 hover:scale-105"
                fill
                src="https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1200&auto=format&fit=crop"
              />
            </div>
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg">
              <Image
                alt="Resort Interior"
                className="object-cover transition-transform duration-700 hover:scale-105"
                fill
                src="https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1200&auto=format&fit=crop"
              />
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-6 -left-6 -z-10 h-48 w-48 rounded-full bg-[#a88b4d]/10 blur-3xl" />
            <div className="absolute -right-6 -top-6 -z-10 h-48 w-48 rounded-full bg-[#a88b4d]/10 blur-3xl" />
          </div>

          {/* Right: Text Content */}
          <div className="flex flex-col justify-center">
            <h2 className="mb-6 font-serif text-3xl font-light uppercase tracking-widest text-[#2b2b2b] md:text-4xl">
              Welcome to <br />
              <span className="text-[#a88b4d]">Manu Maharani</span>
            </h2>
            <div className="mb-8 h-px w-16 bg-[#a88b4d]" />

            <div className="space-y-6 text-base leading-relaxed text-gray-600 md:text-lg">
              <p>
                Located a stone’s throw away from the Jim Corbett National Park
                in Uttarakhand, Manu Maharani Resort & Spa is an ideal
                destination for a peaceful and rejuvenating holiday in the lap
                of wilderness.
              </p>
              <p>
                The chirping of birds, cool breeze and sound of the gurgling
                Kosi river welcome you into this oasis of tranquility. We bring
                nature to your doorstep as views of the amazing Shivalik and the
                green of Corbett embrace you from all sides.
              </p>
              <p>
                Elegance, comfort and amazing hospitality are the essence of
                your sojourn in this Queen of Corbett resort.
              </p>
            </div>

            <div className="mt-8 font-serif text-2xl italic text-[#a88b4d]">
              &quot;Nature&apos;s luxury at its finest.&quot;
            </div>
          </div>
        </div>
      </section>

      {/* Amenities Section */}
      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-16 text-center">
            <span className="mb-2 block text-sm font-bold uppercase tracking-[0.2em] text-[#a88b4d]">
              Our Amenities
            </span>
            <h2 className="font-serif text-3xl font-light uppercase tracking-widest text-[#2b2b2b] md:text-5xl">
              Make Your Stay Memorable
            </h2>
            <div className="mx-auto mt-6 h-px w-24 bg-gray-200" />
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {amenities.map((amenity, index) => (
              <div
                className="group relative overflow-hidden rounded-lg border border-gray-100 bg-[#faf6f1]/50 p-8 transition-all duration-300 hover:border-[#a88b4d]/30 hover:bg-white hover:shadow-lg"
                key={index}
              >
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#a88b4d]/10 text-[#a88b4d] transition-colors duration-300 group-hover:bg-[#a88b4d] group-hover:text-white">
                  <amenity.icon className="h-7 w-7" />
                </div>
                <h3 className="mb-3 font-serif text-xl font-medium text-[#2b2b2b]">
                  {amenity.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-600">
                  {amenity.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 md:py-32">
        <div className="absolute inset-0">
          <Image
            alt="Resort Pool"
            className="object-cover"
            fill
            src="https://images.unsplash.com/photo-1571896349842-6e53ce41e8f2?q=80&w=2000&auto=format&fit=crop"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center text-white">
          <h2 className="mb-6 font-serif text-3xl font-light uppercase tracking-widest md:text-5xl">
            Ready for an Unforgettable Stay?
          </h2>
          <p className="mb-10 text-lg text-white/90 md:text-xl">
            Book your escape to the wilderness today and experience luxury like
            never before.
          </p>
          <Link
            className="inline-block border border-white bg-transparent px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] text-white transition-all duration-300 hover:bg-white hover:text-[#2b2b2b]"
            href="/#reserve"
          >
            Book Your Stay
          </Link>
        </div>
      </section>
    </main>
  );
}
