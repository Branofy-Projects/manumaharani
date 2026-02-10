import { getOffers } from "@repo/actions/offers.actions";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default async function LatestOffers() {
  const { offers } = await getOffers({ limit: 2, status: 'active' });

  console.log("offers", offers);

  return (
    <div className="w-full lg:w-1/2 flex flex-col mt-10 lg:mt-0">
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <h2
          className="text-2xl md:text-3xl font-thin tracking-widest uppercase"
          style={{ color: "#000000" }}
        >
          Latest offers
        </h2>
        <div className="flex items-center gap-4">
          <Link
            className="text-xs md:text-sm font-semibold uppercase tracking-widest border-b border-gray-900 pb-1 hover:text-gray-600 hover:border-gray-600 transition-all mr-4"
            href="/offers"
          >
            View all
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {offers.map((offer, idx) => (
          <div
            className="relative h-[400px] overflow-hidden rounded-lg group cursor-pointer"
            key={idx}
          >
            <Image
              alt={offer.name}
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              fill
              src={offer.image.original_url}
            />
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Content */}
            <div className="absolute bottom-0 left-0 w-full p-6 text-white">
              <h3 className="text-xl md:text-2xl font-bold leading-tight uppercase tracking-widest text-gray-300 mb-2">
                {offer.name}
              </h3>
              <div className="text-xs  mb-1 line-clamp-2">
                {offer.excerpt}
              </div>
              {/* <div className="text-xl md:text-2xl font-light text-gray-200">
                {offer.link}
              </div> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
