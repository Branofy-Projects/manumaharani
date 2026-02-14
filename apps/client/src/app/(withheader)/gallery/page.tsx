import Image from "next/image";
import Link from "next/link";

import { getAllGalleryCache } from "@/lib/cache/gallery.cache";

import { GalleryGrid } from "./gallery-grid";

import type { Metadata } from "next";

export const metadata: Metadata = {
  description:
    "Explore the stunning gallery of Manu Maharani Resort & Spa — rooms, dining, weddings, and breathtaking views of Jim Corbett.",
  title: "Gallery | Manu Maharani Resort & Spa",
};

const CATEGORIES = [
  { href: "/gallery/overview", label: "Overview" },
  { href: "/gallery/room", label: "Rooms" },
  { href: "/gallery/dining", label: "Dining" },
  { href: "/gallery/wedding", label: "Weddings" },
];

export default async function GalleryPage() {
  const gallery = await getAllGalleryCache();

  return (
    <main className="min-h-screen bg-background">
      <section className="relative h-[60vh] min-h-[400px] w-full overflow-hidden">
        <Image
          alt="Gallery - Manu Maharani Resort & Spa"
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
              Our Gallery
            </h1>
            <p className="text-lg font-light text-white/90 mt-10 md:text-xl">
              A visual journey through the beauty and elegance of Manu Maharani
              Resort & Spa.
            </p>
          </div>
        </div>
      </section>

      {/* Category Navigation */}
      <section className="sticky top-0 z-30 border-b border-gray-200 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-center gap-1 sm:gap-2 py-4 overflow-x-auto">
            <Link
              className="inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium border transition-colors bg-primary text-primary-foreground border-primary"
              href="/gallery"
            >
              All
            </Link>
            {CATEGORIES.map((cat) => (
              <Link
                className="inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium border transition-colors border-transparent hover:bg-accent"
                href={cat.href}
                key={cat.href}
              >
                {cat.label}
              </Link>
            ))}
          </nav>
        </div>
      </section>

      <GalleryGrid gallery={gallery} />
    </main>
  );
}
