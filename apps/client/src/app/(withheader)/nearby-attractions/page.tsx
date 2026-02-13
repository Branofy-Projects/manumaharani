import { ChevronRight, Clock, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { getAttractionsCache } from "@/lib/cache/attractions.cache";

import type { Metadata } from "next";

export const metadata: Metadata = {
    description: "Discover lakes, hill towns, temples, and viewpoints around Jim Corbett, all within comfortable driving distance from Manu Maharani Resort & Spa.",
    title: "Nearby Attractions | Manu Maharani Resort & Spa",
};

export default async function NearbyAttractionsPage() {
    const attractions = await getAttractionsCache(true);

    return (
        <main className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative flex min-h-[50vh] items-end overflow-hidden md:min-h-[60vh]">
                <Image
                    alt="Nearby Attractions around Manu Maharani"
                    className="object-cover object-center"
                    fill
                    priority
                    sizes="100vw"
                    src={attractions[0]?.image?.original_url || "https://www.manumaharaniresorts.com/wp-content/uploads/2025/01/mm-executive-room.webp"}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="relative z-10 mx-auto w-full max-w-screen-xl px-4 pb-16 md:pb-20 xl:px-0">
                    <nav className="mb-6 flex items-center gap-2 text-sm text-white/70">
                        <Link className="hover:text-white transition" href="/">Home</Link>
                        <ChevronRight className="h-4 w-4" />
                        <span className="text-white">Nearby Attractions</span>
                    </nav>
                    <h1 className="font-thin tracking-[0.2em] text-3xl uppercase text-white md:text-5xl">
                        Nearby Attractions
                    </h1>
                    <p className="mt-4 max-w-2xl font-serif text-base text-white/80 md:text-lg">
                        Extend your stay to discover lakes, hill towns, temples, and viewpoints
                        around Corbett, all within comfortable driving distance from Manu Maharani.
                    </p>
                </div>
            </section>

            {/* Attractions Grid */}
            <section className="mx-auto w-full max-w-screen-xl px-4 py-16 md:py-24 xl:px-0">
                <div className="mb-12 text-center md:mb-16">
                    <h2 className="font-thin tracking-widest text-2xl uppercase text-[#2b2b2b] md:text-4xl">
                        Places to Explore
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl font-serif text-base text-[#5a5a5a] md:text-lg">
                        From serene lakes to ancient temples, the region around Jim Corbett offers countless experiences.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {attractions.map((attraction) => {
                        const displayImage = attraction.image?.original_url || attraction.image?.large_url;
                        return (
                            <Link
                                className="group flex flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl"
                                href={`/nearby-attractions/${attraction.slug}`}
                                key={attraction.id}
                            >
                                {/* Image */}
                                <div className="relative aspect-[4/3] w-full overflow-hidden">
                                    {displayImage ? (
                                        <Image
                                            alt={attraction.image?.alt_text || attraction.title}
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            src={displayImage}
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-gray-100">
                                            <span className="text-sm text-gray-400">No image</span>
                                        </div>
                                    )}
                                    {attraction.distance && (
                                        <div className="absolute bottom-3 right-3 rounded-full bg-white/90 px-4 py-1.5 text-sm font-semibold text-[#2b2b2b] backdrop-blur-sm">
                                            {attraction.distance}
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex flex-1 flex-col p-6 md:p-8">
                                    <h3 className="font-thin tracking-widest text-lg uppercase text-[#2b2b2b] md:text-xl">
                                        {attraction.title}
                                    </h3>

                                    {/* Quick Info */}
                                    <div className="mt-3 flex flex-wrap gap-4 text-sm text-[#5a5a5a]">
                                        {attraction.distance && (
                                            <div className="flex items-center gap-1.5">
                                                <MapPin className="h-4 w-4" />
                                                <span>{attraction.distance}</span>
                                            </div>
                                        )}
                                        {(attraction.open_time || attraction.close_time) && (
                                            <div className="flex items-center gap-1.5">
                                                <Clock className="h-4 w-4" />
                                                <span>{[attraction.open_time, attraction.close_time].filter(Boolean).join(" - ")}</span>
                                            </div>
                                        )}
                                    </div>

                                    <p className="mt-4 font-serif text-sm leading-relaxed text-[#5a5a5a] line-clamp-3 md:text-base">
                                        {attraction.description || attraction.subtitle}
                                    </p>

                                    <div className="mt-auto pt-6">
                                        <span className="inline-flex items-center gap-1 text-xs font-semibold tracking-[0.15em] uppercase text-[#b68833] transition group-hover:gap-2">
                                            View Details
                                            <ChevronRight className="h-4 w-4" />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {attractions.length === 0 && (
                    <div className="py-20 text-center">
                        <p className="font-serif text-lg text-[#5a5a5a]">
                            Attraction information is being updated. Please check back soon.
                        </p>
                    </div>
                )}
            </section>
        </main>
    );
}
