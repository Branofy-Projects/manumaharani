import {
  BuildingLibraryIcon,
  BuildingStorefrontIcon,
  MapPinIcon,
  PhotoIcon,
  SparklesIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";
import { GemIcon, PhoneIcon, UtensilsIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { MdCelebration } from "react-icons/md";

const shortcuts = [
  {
    href: "/photos-videos",
    icon: PhotoIcon,
    label: "PHOTOS & VIDEOS",
  },
  {
    href: "/rooms",
    icon: BuildingLibraryIcon,
    label: "ACCOMMODATIONS",
  },
  {
    href: "/wedding",
    icon: GemIcon,
    label: "WEDDING",

  },
  {
    href: "/fine-dining",
    icon: BuildingStorefrontIcon,
    label: "DINING",
  },
  {
    href: "/events",
    icon: BuildingStorefrontIcon,
    label: "MICE",
  },
  {
    href: "/contact-us",
    icon: PhoneIcon,
    label: "CONTACT US",
  },
];

export default function SectionShortcuts() {
  return (
    <section className="w-full flex justify-center py-8 px-4 xl:px-0 md:py-16">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 flex-wrap gap-4 md:gap-8 max-w-5xl w-full justify-center">
        {shortcuts.map(({ href, icon: Icon, label }) => (
          <Link
            className="border border-gray-300 py-4 md:py-6 px-2 md:px-4 rounded-md flex flex-col items-center justify-center shadow-sm transition hover:shadow-lg hover:border-gray-400"
            href={href}
            key={label}
          >
            <Icon className="w-6 h-6 md:w-8 md:h-8 text-gray-700 mb-3 md:mb-6" />
            <span className="text-gray-800 font-medium tracking-widest text-[0.7rem] md:text-[0.6rem] text-center">
              {label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
