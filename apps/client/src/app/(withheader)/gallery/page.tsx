import Image from "next/image";

import { getAllGalleryCache } from "@/lib/cache/gallery.cache";

import { GallerySection } from "./gallery-section";

import type { Metadata } from "next";

export const metadata: Metadata = {
  description:
    "Explore the stunning gallery of Manu Maharani Resort & Spa — rooms, dining, weddings, and breathtaking views of Jim Corbett.",
  title: "Gallery | Manu Maharani Resort & Spa",
};

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

      <GallerySection gallery={gallery} />
    </main>
  );
}
