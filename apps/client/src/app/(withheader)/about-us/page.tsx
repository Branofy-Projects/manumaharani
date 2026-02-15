
import {
  ClockIcon,
  WifiIcon,
} from "@heroicons/react/24/solid";
import { CarIcon, LaptopIcon, SmileIcon, UtensilsIcon, WavesLadderIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import type { Metadata } from "next";

const amenities = [
  {
    description:
      "Need more connectivity during your Corbett escape? Upgrading your bandwidth is quick and effortless, and can be done right from your phone, ensuring you stay seamlessly connected while you unwind in nature.",
    icon: WifiIcon,
    title: "High Speed WiFi",
  },
  {
    description:
      "Our dedicated team is always on hand to make your stay effortless and memorable, whether it’s helping with reservations, arranging safari permits, or taking care of any special requests. From the moment you plan your visit to your time at Manu Maharani resort, we’re here to ensure every detail feels thoughtfully taken care of.",
    icon: ClockIcon,
    title: "Reservations 24/7",
  },
  {
    description: "Begin your day at Nivalaya, our multi-cuisine restaurant, with a generous breakfast buffet designed to energize you for what lies ahead.",
    icon: UtensilsIcon,
    title: "Breakfast Included",
  },
  {
    description:
      "Our spacious, family-friendly pool set within the clubhouse invites you to unwind with refreshing dips, surrounded by soothing green views. It’s the perfect place to relax and recharge after a morning spent exploring the forest.",
    icon: WavesLadderIcon,
    title: "Outdoor Swimming Pool",
  },
  {
    description:
      "Thoughtfully designed indoor and outdoor play zones, complete with slides, climbers, and swings, offer children a safe and joyful space to explore and play, while families relax and unwind on the surrounding lawns.",
    icon: SmileIcon,
    title: "Kids' Playground",
  },
  {
    description: "Secure on-site parking for cars and coaches ensures smooth, hassle-free arrivals, making it especially convenient for road travellers and corporate groups visiting Jim Corbett.",
    icon: CarIcon,
    title: "Ample Parking Space",
  },
  {
    description: "Quiet corners, reliable Wi-Fi, and thoughtfully designed flexible spaces allow you to strike a seamless balance between work and wilderness, making extended stays both productive and rejuvenating.",
    icon: LaptopIcon,
    title: "Work From Anywhere"
  }
];


export const metadata: Metadata = {
  description: "Discover the oasis of tranquility in the lap of wilderness",
  title: "About Us",
};

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
          sizes="100vw"
          src="/about-us/photo-1566073771259-6a8506099945.webp"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
          <h1 className="text-4xl  uppercase tracking-[0.2em] md:text-6xl">
            The Soul of Corbett, Reimagined
          </h1>
          <div className="mt-4 h-px w-24 bg-white/80" />
          <p className="mt-4 max-w-2xl px-4 font-serif text-lg italic text-white/90 md:text-xl">
            A Legacy of Riverside Luxury, Powered by the Vision of Mahaveer Multicreation.
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
                sizes="(max-width: 768px) 100vw, 50vw"
                src="/about-us/photo-1582719508461-905c673771fd.webp"
              />
            </div>
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg">
              <Image
                alt="Resort Interior"
                className="object-cover transition-transform duration-700 hover:scale-105"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                src="/about-us/photo-1590490360182-c33d57733427.webp"
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

            <div className="space-y-8 text-base leading-relaxed text-gray-600 md:text-lg">
              <div>
                <h3 className="mb-3 font-serif text-xl font-semibold text-[#2b2b2b]">A Heritage Reborn</h3>
                <p>
                  Manu Maharani has long been a landmark of tranquility in Jim Corbett. For years, we have served as the silent witness to the Kosi River&apos;s flow and the Shivalik&apos;s majesty. Today, that legacy enters its most exciting chapter. Under the stewardship of Mahaveer Multicreation, Manu Maharani has transitioned from a renowned name into a dynamic, homegrown hospitality powerhouse.
                </p>
              </div>

              <div>
                <h3 className="mb-3 font-serif text-xl font-semibold text-[#2b2b2b]">The Power of Independence</h3>
                <p>
                  While others chase the rigid constraints of global chain SOPs, we believe in the luxury of flexibility. As a flagship of Mahaveer Multicreation, we have discarded the &ldquo;cookie-cutter&rdquo; approach to hospitality. Our independence is our greatest strength&mdash;it allows us to pivot instantly to our guests&apos; needs, curating experiences that are as unique as the wilderness surrounding us.
                </p>
              </div>

              <div>
                <h3 className="mb-3 font-serif text-xl font-semibold text-[#2b2b2b]">Homegrown Heart, Global Standards</h3>
                <p>
                  We are a &ldquo;Homegrown Global Brand.&rdquo; This means we pair the warmth of Indian Atithi Devo Bhava with international standards of service, design, and sustainability. We don&apos;t just follow trends; we set them. By blending local Kumaoni soul with world-class infrastructure, we provide an experience that is authentic to Corbett but sophisticated enough for the global traveler.
                </p>
              </div>

              <div>
                <h3 className="mb-3 font-serif text-xl font-semibold text-[#2b2b2b]">Our Core Philosophy</h3>
                <ul className="space-y-4">
                  <li>
                    <span className="font-semibold text-[#2b2b2b]">Agility Over Bureaucracy:</span> We prioritize the guest experience over corporate handbooks. If a guest desires a midnight feast by the river or a bespoke safari itinerary, we make it happen&mdash;no layers of approval required.
                  </li>
                  <li>
                    <span className="font-semibold text-[#2b2b2b]">The &ldquo;Sensory Sanctuary&rdquo; Vibe:</span> Every corner of our 11-acre estate is designed to be a standalone masterpiece. From the architecture that breathes with the forest to the culinary stories told at Dasos, we are a destination within ourselves.
                  </li>
                  <li>
                    <span className="font-semibold text-[#2b2b2b]">Rooted Growth:</span> Mahaveer Multicreation&apos;s vision is to take the essence of Indian hospitality to the world stage, starting right here on the banks of the Kosi.
                  </li>
                </ul>
              </div>

              <blockquote className="border-l-4 border-[#a88b4d] pl-6 font-serif text-lg italic text-[#2b2b2b]">
                &ldquo;We don&apos;t manage rooms; we curate memories. Our brand is built on the freedom to be extraordinary.&rdquo;
                <footer className="mt-2 text-sm font-normal not-italic text-gray-500">
                  &mdash; Leadership Team, Mahaveer Multicreation
                </footer>
              </blockquote>
            </div>

            {/* <div className="mt-8 font-serif text-2xl italic text-[#a88b4d]">
              &quot;Nature&apos;s luxury at its finest.&quot;
            </div> */}
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
                <h3 className="mb-3 font-serif text-xl font-semibold text-[#2b2b2b]">
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
            sizes="100vw"
            src="/about-us/photo-467463764734-c945839849384.webp"
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
