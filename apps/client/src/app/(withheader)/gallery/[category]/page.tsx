import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getGalleryByCategoryCache } from "@/lib/cache/gallery.cache";

import { GalleryGrid } from "../gallery-grid";

import type { Metadata } from "next";

const CATEGORIES = {
  dining: {
    description:
      "Explore our exquisite dining spaces at Manu Maharani Resort & Spa — from fine dining restaurants to rooftop experiences in Jim Corbett.",
    label: "Dining",
    title: "Dining Gallery",
  },
  overview: {
    description:
      "Discover the stunning landscapes, architecture, and amenities of Manu Maharani Resort & Spa in Jim Corbett.",
    label: "Overview",
    title: "Resort Overview Gallery",
  },
  room: {
    description:
      "Browse our luxurious rooms and suites at Manu Maharani Resort & Spa — riverside views, modern amenities, and elegant interiors.",
    label: "Rooms",
    title: "Rooms Gallery",
  },
  wedding: {
    description:
      "View our stunning wedding venues and celebrations at Manu Maharani Resort & Spa — the perfect destination wedding in Jim Corbett.",
    label: "Weddings",
    title: "Wedding Gallery",
  },
} as const;

type CategoryKey = keyof typeof CATEGORIES;

const isValidCategory = (category: string): category is CategoryKey =>
  category in CATEGORIES;

export default async function GalleryCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;

  if (!isValidCategory(category)) {
    notFound();
  }

  const cat = CATEGORIES[category];
  const gallery = await getGalleryByCategoryCache(category);

  return (
    <main className="min-h-screen bg-background">
      <section className="relative h-[60vh] min-h-[400px] w-full overflow-hidden">
        <Image
          alt={`${cat.title} - Manu Maharani Resort & Spa`}
          className="object-cover object-center"
          fill
          priority
          sizes="100vw"
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=80"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 pt-[80px] flex items-center justify-center">
          <div className="text-center">
            <h1 className="mb-4 text-4xl px-16 tracking-[0.2em] md:tracking-[0.3em] uppercase text-white md:text-5xl lg:text-6xl">
              {cat.title}
            </h1>
            <p className="text-lg font-light text-white/90 mt-10 md:text-xl max-w-2xl mx-auto px-4">
              {cat.description}
            </p>
          </div>
        </div>
      </section>

      {/* Category Navigation */}
      <section className="sticky top-0 z-30 border-b border-gray-200 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-center gap-1 sm:gap-2 py-4 overflow-x-auto">
            <Link
              className="inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium border transition-colors border-transparent hover:bg-accent"
              href="/gallery"
            >
              All
            </Link>
            {Object.entries(CATEGORIES).map(([key, value]) => (
              <Link
                className={`inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium border transition-colors ${key === category
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-transparent hover:bg-accent"
                  }`}
                href={`/gallery/${key}`}
                key={key}
              >
                {value.label}
              </Link>
            ))}
          </nav>
        </div>
      </section>

      <GalleryGrid gallery={gallery} />
    </main>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;

  if (!isValidCategory(category)) {
    return { title: "Not Found" };
  }

  const cat = CATEGORIES[category];

  return {
    description: cat.description,
    title: `${cat.title} | Manu Maharani Resort & Spa`,
  };
}

export function generateStaticParams() {
  return Object.keys(CATEGORIES).map((category) => ({ category }));
}
