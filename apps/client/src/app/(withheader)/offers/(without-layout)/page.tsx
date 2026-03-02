import Image from "next/image";
import Link from "next/link";
import React from "react";

import { getOffersCache } from "@/lib/cache/offer.cache";


export default async function OffersPage() {
  const offers = await getOffersCache()
  return (
    <div className="grid grid-cols-1 max-w-screen-xl w-full mx-auto md:grid-cols-2 lg:grid-cols-4 gap-6 px-4 xl:px-0">
      {offers.map((offer) => (
        <Link
          className="bg-white rounded-lg overflow-hidden flex flex-col group cursor-pointer shadow-sm hover:shadow-md transition-shadow"
          href={offer.slug ? `/offers/${offer.slug}` : "#"}
          key={offer.id}
        >
          <div className="relative w-full aspect-[4/3] overflow-hidden">
            {offer.image && (
              <Image
                alt={offer.name}
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                src={offer.image.original_url}
              />
            )}
            {/* Price badge */}
            {(offer.discounted_price || offer.original_price) && (
              <div className="absolute bottom-3 left-3 rounded bg-white/90 px-2 py-1 backdrop-blur-sm">
                {offer.discounted_price ? (
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-gray-900">
                      ₹{Number(offer.discounted_price).toLocaleString()}
                    </span>
                    {offer.original_price &&
                      Number(offer.original_price) > Number(offer.discounted_price) && (
                        <span className="text-xs text-gray-500 line-through">
                          ₹{Number(offer.original_price).toLocaleString()}
                        </span>
                      )}
                  </div>
                ) : (
                  <span className="font-bold text-gray-900">
                    ₹{Number(offer.original_price).toLocaleString()}
                  </span>
                )}
              </div>
            )}
            {/* Category badge */}
            {offer.category && (
              <div className="absolute top-3 left-3 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold uppercase text-amber-800">
                {offer.category}
              </div>
            )}
          </div>
          <div className="p-6 flex flex-col flex-grow">
            <h3 className="text-xl font-serif mb-2 leading-tight text-black group-hover:text-amber-700 transition-colors">
              {offer.name}
            </h3>
            {offer.duration && (
              <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-3">
                {offer.duration}
              </p>
            )}
            <p className="text-gray-600 text-sm mb-6 flex-grow line-clamp-3">
              {offer.excerpt}
            </p>
            <span className="w-full border border-black text-black rounded-sm py-3 text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors text-center">
              View details
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
