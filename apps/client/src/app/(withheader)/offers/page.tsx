import { getOffers } from "@repo/actions/offers.actions";
import { Check } from "lucide-react";
import Image from "next/image";
import React from "react";


const OFFERS = [
  {
    category: "Hotel",
    description:
      "Semi-Annual Sale savings are here! Enjoy up to 30% off room rates. Join us for a memorable stay.",
    id: 1,
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80",
    subtitle: "Manu Maharani Resorts",
    title: "Save Up to 30% Off Room Rates",
  },
  {
    category: "Hotel",
    description:
      "Semi-Annual Sale savings are here! Save More. Play More. Enjoy up to 45% off room rates.",
    id: 2,
    image:
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=600&q=80",
    subtitle: "Manu Maharani Resorts",
    title: "Save Up to 45% Off Room Rates",
  },
  {
    category: "Hotel",
    description:
      "Treat yourself with $75 in food and beverage credit, per night. Indulge in our fine dining experiences.",
    id: 3,
    image:
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80",
    subtitle: "Manu Maharani Resorts",
    title: "Daily F&B Credit",
  },
  {
    category: "Hotel",
    description:
      "Save up to 10% when you stay 4 or more nights booked at least 60 days in advance.",
    id: 4,
    image:
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=600&q=80",
    subtitle: "Manu Maharani Resorts",
    title: "Stay Longer, Save More",
  },
];

export default async function OffersPage() {
  const { offers } = await getOffers({ status: 'active' });
  return (
    <div className="grid grid-cols-1 max-w-screen-xl w-full mx-auto md:grid-cols-2 lg:grid-cols-4 gap-6 px-4 xl:px-0">
      {offers.map((offer) => (
        <div
          className="bg-white rounded-lg overflow-hidden flex flex-col group cursor-pointer shadow-sm hover:shadow-md transition-shadow"
          key={offer.id}
        >
          <div className="relative w-full aspect-[4/3] overflow-hidden">
            <Image
              alt={offer.name}
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              fill
              src={offer.image.original_url}
            />
          </div>
          <div className="p-6 flex flex-col flex-grow">
            <h3 className="text-xl font-serif mb-2 leading-tight text-black">
              {offer.name}
            </h3>
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-3">
              {/* {offer.subtitle} */}
            </p>
            <p className="text-gray-600 text-sm mb-6 flex-grow line-clamp-3">
              {offer.excerpt}
            </p>
            <button className="w-full border border-black text-black rounded-sm py-3 text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors">
              View details
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
