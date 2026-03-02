import {
    ChevronDown,
    ChevronRight,
    Clock,
    MapPin,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getAttractionBySlugCache, getAttractionsCache } from "@/lib/cache/attractions.cache";

import { AttractionBookingCard } from "./components/AttractionBookingCard";
import { AttractionGallery } from "./components/AttractionGallery";
import { MobileBookingBar } from "./components/MobileBookingBar";

import type { Metadata } from "next";

type PageProps = {
    params: Promise<{ slug: string }>;
};

export default async function AttractionDetailPage({ params }: PageProps) {
    const { slug } = await params;
    const attraction = await getAttractionBySlugCache(slug);

    if (!attraction) {
        notFound();
    }

    let faqs: Array<{ answer?: string; question?: string }> = [];

    if (attraction.faq) {
        try {
            const parsed = JSON.parse(attraction.faq);
            if (Array.isArray(parsed)) {
                faqs = parsed;
            }
        } catch {
            // not JSON, skip
        }
    }

    const galleryImages = [
        ...(attraction.image ? [attraction.image.original_url] : []),
        ...(attraction.images?.map((img) => img.image.original_url) || []),
    ];

    return (
        <main className="min-h-screen bg-background pb-20 pt-[72px] md:pt-[88px] lg:pb-0">
            {/* Breadcrumb */}
            <div className="border-b border-b-gray-200">
                <div className="mx-auto max-w-screen-xl px-4 py-3">
                    <nav className="flex items-center gap-2 text-sm">
                        <Link className="font-sans font-light text-sm text-[#5a5a5a] hover:text-[#2b2b2b] hover:underline" href="/">
                            Home
                        </Link>
                        <ChevronRight className="h-4 w-4 text-[#5a5a5a]" />
                        <Link className="font-sans font-light text-sm text-[#5a5a5a] hover:text-[#2b2b2b] hover:underline" href="/nearby-attractions">
                            Nearby
                        </Link>
                        <ChevronRight className="h-4 w-4 text-[#5a5a5a]" />
                        <span className="font-sans font-light text-sm text-[#2b2b2b] line-clamp-1">{attraction.title}</span>
                    </nav>
                </div>
            </div>

            {/* Image Gallery */}
            {galleryImages.length > 0 && (
                <AttractionGallery images={galleryImages} title={attraction.title} />
            )}

            {/* Main Content */}
            <div className="mx-auto max-w-screen-xl px-4 py-8">
                <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
                    {/* Left Column - Details */}
                    <div className="lg:col-span-2">
                        {/* Title Section */}
                        <div className="mb-6">
                            <h1 className="mb-3  tracking-widest text-2xl leading-tight text-[#2b2b2b] md:text-4xl lg:text-4xl">
                                {attraction.title.toUpperCase()}
                            </h1>
                            {/* {attraction.subtitle && (
                                <p className="font-serif text-base text-[#5a5a5a] md:text-lg">
                                    {attraction.subtitle}
                                </p>
                            )} */}
                        </div>

                        {/* Key Info Pills */}
                        <div className="mb-8 flex flex-wrap gap-3">
                            {attraction.distance && (
                                <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-2">
                                    <MapPin className="h-4 w-4 text-[#5a5a5a]" />
                                    <span className="font-sans text-sm text-[#5a5a5a]">{attraction.distance}</span>
                                </div>
                            )}
                            {(attraction.open_time || attraction.close_time) && (
                                <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-2">
                                    <Clock className="h-4 w-4 text-[#5a5a5a]" />
                                    <span className="font-sans text-sm text-[#5a5a5a]">
                                        {[attraction.open_time, attraction.close_time].filter(Boolean).join(" - ")}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* About Section */}
                        <section className="mb-10 border-t pt-8" id="about">
                            <h2 className="mb-4  tracking-widest text-xl uppercase text-[#2b2b2b] md:text-2xl">
                                About this attraction
                            </h2>
                            <div className="prose prose-gray max-w-none">
                                <p className="font-sans text-base  leading-relaxed text-[#5a5a5a] whitespace-pre-line md:text-lg">
                                    {attraction.description || attraction.subtitle}
                                </p>
                            </div>
                        </section>

                        {/* FAQs Section */}
                        {faqs.length > 0 && (
                            <section className="mb-10 border-t pt-8" id="faqs">
                                <h2 className="mb-6 text-xl  uppercase text-[#2b2b2b] md:text-2xl">
                                    Frequently asked questions
                                </h2>
                                <div className="divide-y divide-gray-200 rounded-lg border border-gray-200">
                                    {faqs.map((faq, index) => (
                                        <details className="group" key={index}>
                                            <summary className="flex cursor-pointer items-center justify-between p-4 hover:bg-gray-50">
                                                <span className="font-sans font-light text-black pr-4">{faq.question}</span>
                                                <ChevronDown className="h-5 w-5 flex-shrink-0 text-[#5a5a5a] transition-transform group-open:rotate-180" />
                                            </summary>
                                            <div className="px-4 pb-4">
                                                <p className="font-sans text-sm  leading-relaxed text-[#5a5a5a] md:text-base">{faq.answer}</p>
                                            </div>
                                        </details>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Right Column - Booking Card (Desktop only) */}
                    <div className="hidden lg:col-span-1 lg:block">
                        <AttractionBookingCard
                            attractionId={attraction.id}
                            closeTime={attraction.close_time}
                            distance={attraction.distance}
                            openTime={attraction.open_time}
                        />
                    </div>
                </div>
            </div>

            {/* Mobile Sticky Booking Bar */}
            <MobileBookingBar
                attractionId={attraction.id}
                title={attraction.title}
            />
        </main>
    );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const attraction = await getAttractionBySlugCache(slug);

    if (!attraction) {
        return { title: "Attraction Not Found" };
    }

    return {
        description: attraction.description || attraction.subtitle,
        openGraph: {
            description: attraction.description || attraction.subtitle,
            images: attraction.image ? [attraction.image.original_url] : [],
            title: attraction.title,
        },
        title: `${attraction.title} | Manu Maharani Resort & Spa`,
    };
}

export async function generateStaticParams() {
    const attractions = await getAttractionsCache(true);

    return attractions
        .filter((a) => a.slug)
        .map((a) => ({
            slug: a.slug,
        }));
}
