import Image from "next/image";
import Link from "next/link";

import { getInstaGalleryCache } from "@/lib/cache/gallery.cache";

export default async function HomeInstaImageSection() {
  const gallery = await getInstaGalleryCache();

  if (!gallery || gallery.length === 0) return null;

  return (
    <section className="w-full py-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <p className="uppercase tracking-[0.3em] text-sm text-muted-foreground">
            Follow Us
          </p>
          <h2 className="text-3xl md:text-4xl  tracking-widest text-center mb-12 uppercase">
            In Touch With Manu Maharani
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Intro card */}
          <div className="bg-[#4a4a4a] aspect-square text-white p-6 sm:p-8 flex flex-col justify-between min-h-[220px]">
            <div>
              <h3 className="text-base sm:text-xl md:text-2xl tracking-wide">
                MANU MAHARANI RESORTS
              </h3>
              <p className="mt-4 text-[0.5rem] md:text-sm sm:text-base opacity-90">
                Catch glimpses of river mornings, festive evenings, and
                behind‑the‑scenes life <b>@manumaharaniresorts</b>
              </p>
            </div>
            <Link className="mt-10" href="https://www.instagram.com/manumaharaniresorts/" target="_blank">
              <span className="inline-block text-[0.5rem] md:text-sm sm:text-base tracking-wider">
                Follow Our Journey
              </span>
              <div className="h-px w-40 bg-white mt-1" />
            </Link>
          </div>

          {gallery.slice(0, 7).map((item, i) => {
            const src =
              item.image?.large_url ||
              item.image?.original_url ||
              item.image?.medium_url;

            if (!src) return null;

            return (
              <Link
                className="group relative aspect-square overflow-hidden"
                href="https://www.instagram.com/manumaharaniresorts/"
                key={item.id ?? `insta-${i}`}
                target="_blank"
              >
                <Image
                  alt={item.image?.alt_text || item.title || "Gallery image"}
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  fill
                  loading="lazy"
                  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                  src={src}
                />
                <div className="pointer-events-none absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="pointer-events-none absolute inset-0 flex items-end p-4">
                  <div className="text-white w-full translate-y-3 opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                    <p className="text-[0.5rem] md:text-xs opacity-90">Share your memories with</p>
                    <p className="text-[0.5rem] md:text-sm font-medium">@manumaharaniresorts</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
