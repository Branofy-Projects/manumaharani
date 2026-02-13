import { getAllOffersSlugs, getRelatedOffers } from "@repo/actions/offers.actions";
import {
    Check,
    ChevronDown,
    ChevronRight,
    Clock,
    Globe,
    Info,
    MapPin,
    Shield,
    Star,
    Ticket,
    Users,
    X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { LexicalRenderer } from "@/components/lexical-renderer";
import { getOfferBySlugCache, getOffersCache, getRelatedOffersCache } from "@/lib/cache/offer.cache";

import { MobileBookingBar } from "./components/MobileBookingBar";
import { OfferBookingCard } from "./components/OfferBookingCard";
import { OfferGallery } from "./components/OfferGallery";
import { OfferItinerarySection } from "./components/OfferItinerarySection";


type PageProps = {
    params: Promise<{ "offer-slug": string }>;
};

export async function generateMetadata({ params }: PageProps) {
    const { "offer-slug": offerSlug } = await params;
    const offer = await getOfferBySlugCache(offerSlug);

    if (!offer) {
        return {
            title: "Offer Not Found",
        };
    }

    return {
        description: offer.meta_description || offer.excerpt,
        openGraph: {
            description: offer.meta_description || offer.excerpt,
            images: offer.image ? [offer.image.original_url] : [],
            title: offer.meta_title || offer.name,
        },
        title: offer.meta_title || offer.name,
    };
}

export async function generateStaticParams() {
    const offers = await getAllOffersSlugs({ status: 'active' })

    return offers
        .filter((offer) => offer.slug)
        .map((offer) => ({
            "offer-slug": offer.slug,
        }));
}

export default async function OfferDetailPage({ params }: PageProps) {
    const { "offer-slug": offerSlug } = await params;
    const offer = await getOfferBySlugCache(offerSlug);

    if (!offer) {
        notFound();
    }

    const relatedOffers = await getRelatedOffersCache(offer.id, offer.category, 4);

    // Parse languages if stored as JSON
    let languages: string[] = [];
    try {
        languages = offer.languages ? JSON.parse(offer.languages) : [];
    } catch {
        languages = offer.languages ? [offer.languages] : [];
    }

    // Separate included and excluded highlights
    const includedHighlights = offer.highlights?.filter((h) => h.type === "included") || [];
    const excludedHighlights = offer.highlights?.filter((h) => h.type === "excluded") || [];

    // Get all gallery images
    const galleryImages = [
        ...(offer.image ? [offer.image.original_url] : []),
        ...(offer.images?.map((img) => img.image.original_url) || []),
    ];

    // Calculate discount percentage
    const hasDiscount =
        offer.original_price &&
        offer.discounted_price &&
        Number(offer.original_price) > Number(offer.discounted_price);
    const discountPercentage = hasDiscount
        ? Math.round(
            ((Number(offer.original_price) - Number(offer.discounted_price)) /
                Number(offer.original_price)) *
            100
        )
        : 0;

    return (
        <main className="min-h-screen bg-background pb-20 lg:pb-0">
            {/* Breadcrumb */}
            <div className="border-b border-b-gray-200 bg-gray-50">
                <div className="mx-auto max-w-screen-xl px-4 py-3">
                    <nav className="flex items-center gap-2 text-sm">
                        <Link className="font-sans font-light text-sm text-[#5a5a5a] hover:text-[#2b2b2b] hover:underline" href="/">
                            Home
                        </Link>
                        <ChevronRight className="h-4 w-4 text-[#5a5a5a]" />
                        <Link className="font-sans font-light text-sm text-[#5a5a5a] hover:text-[#2b2b2b] hover:underline" href="/offers">
                            Experiences
                        </Link>
                        <ChevronRight className="h-4 w-4 text-[#5a5a5a]" />
                        <span className="font-sans font-light text-sm text-[#2b2b2b] line-clamp-1">{offer.name}</span>
                    </nav>
                </div>
            </div>

            {/* Gallery Section */}
            <OfferGallery images={galleryImages} title={offer.name} />

            {/* Main Content */}
            <div className="mx-auto max-w-screen-xl px-4 py-8">
                <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
                    {/* Left Column - Details */}
                    <div className="lg:col-span-2">
                        {/* Title Section */}
                        <div className="mb-6">
                            <h1 className="mb-3 font-thin tracking-widest text-2xl leading-tight text-[#2b2b2b] md:text-4xl lg:text-4xl">
                                {offer.name.toUpperCase()}
                            </h1>

                            {/* Rating & Reviews Row */}
                            <div className="flex flex-wrap items-center gap-3">
                                {offer.rating && (
                                    <div className="flex items-center gap-1.5">
                                        <div className="flex items-center gap-0.5 rounded bg-green-600 px-1.5 py-0.5">
                                            <Star className="h-3.5 w-3.5 fill-white text-white" />
                                            <span className="text-sm font-bold text-white">{offer.rating}</span>
                                        </div>
                                        {offer.review_count && offer.review_count > 0 && (
                                            <span className="text-sm text-gray-600">
                                                {offer.review_count.toLocaleString()} reviews
                                            </span>
                                        )}
                                    </div>
                                )}
                                {offer.location && (
                                    <div className="flex items-center gap-1 font-serif text-sm text-[#5a5a5a]">
                                        <MapPin className="h-4 w-4" />
                                        <span>{offer.location}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Key Info Pills */}
                        <div className="mb-8 flex flex-wrap gap-3">
                            {offer.free_cancellation && (
                                <div className="flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-2">
                                    <Shield className="h-4 w-4 text-green-600" />
                                    <span className="font-serif text-sm font-medium text-green-700">Free cancellation</span>
                                </div>
                            )}
                            {offer.duration && (
                                <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-2">
                                    <Clock className="h-4 w-4 text-[#5a5a5a]" />
                                    <span className="font-serif text-sm text-[#5a5a5a]">{offer.duration}</span>
                                </div>
                            )}
                            {offer.max_group_size && (
                                <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-2">
                                    <Users className="h-4 w-4 text-[#5a5a5a]" />
                                    <span className="font-serif text-sm text-[#5a5a5a]">Max {offer.max_group_size} people</span>
                                </div>
                            )}
                            {languages.length > 0 && (
                                <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-2">
                                    <Globe className="h-4 w-4 text-[#5a5a5a]" />
                                    <span className="font-serif text-sm text-[#5a5a5a]">{languages.join(", ")}</span>
                                </div>
                            )}
                        </div>

                        {/* About This Experience */}
                        <section className="mb-10 border-t pt-8" id="about">
                            <h2 className="mb-4 font-thin tracking-widest text-xl uppercase text-[#2b2b2b] md:text-2xl">
                                About this experience
                            </h2>
                            <div className="prose prose-gray max-w-none">
                                <LexicalRenderer content={offer.description} />
                                {/* <p className="font-serif text-base  leading-relaxed text-[#5a5a5a] whitespace-pre-line md:text-lg">
                                    {offer.description}
                                </p> */}
                            </div>
                        </section>

                        {/* What's Included Section */}
                        {(includedHighlights.length > 0 || excludedHighlights.length > 0) && (
                            <section className="mb-10 border-t pt-8" id="whats-included">
                                <h2 className="mb-6 text-2xl font-thin uppercase text-[#2b2b2b] md:text-2xl">
                                    What&apos;s included
                                </h2>
                                <div className="grid gap-8 md:grid-cols-2">
                                    {includedHighlights.length > 0 && (
                                        <div>
                                            <ul className="space-y-3">
                                                {includedHighlights.map((highlight) => (
                                                    <li className="flex items-start gap-3" key={highlight.id}>
                                                        <div className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-green-100">
                                                            <Check className="h-3 w-3 text-green-600" />
                                                        </div>
                                                        <span className="font-sans text-lg font-thin leading-relaxed p-0">{highlight.text}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    {excludedHighlights.length > 0 && (
                                        <div>
                                            <ul className="space-y-3">
                                                {excludedHighlights.map((highlight) => (
                                                    <li className="flex items-start gap-3" key={highlight.id}>
                                                        <div className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
                                                            <X className="h-3 w-3 text-red-600" />
                                                        </div>
                                                        <span className="font-sans text-lg font-thin leading-relaxed p-0">{highlight.text}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </section>
                        )}

                        {/* What to Expect / Itinerary */}
                        {offer.itinerary && offer.itinerary.length > 0 && (
                            <section className="mb-10 border-t pt-8" id="itinerary">
                                <OfferItinerarySection itinerary={offer.itinerary} />
                            </section>
                        )}

                        {/* Additional Info Section */}
                        {(offer.booking_notice || offer.cancellation_policy) && (
                            <section className="mb-10 border-t pt-8" id="additional-info">
                                <h2 className="mb-6 text-xl font-thin uppercase text-[#2b2b2b] md:text-2xl">
                                    Additional information
                                </h2>

                                {/* Booking Notice */}
                                {offer.booking_notice && (
                                    <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
                                        <div className="flex gap-3">
                                            <Info className="h-5 w-5 flex-shrink-0 text-amber-700" />
                                            <div>
                                                <p className="font-sans font-light text-amber-700">Important information</p>
                                                <p className="mt-1 font-sans font-thin text-sm text-amber-700 md:text-base">{offer.booking_notice}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Cancellation Policy */}
                                {offer.cancellation_policy && (
                                    <div className="rounded-lg border border-gray-200 p-4">
                                        <div className="flex gap-3">
                                            <Ticket className="h-5 w-5 flex-shrink-0 text-gray-600" />
                                            <div>
                                                <p className="font-sans font-light text-[#2b2b2b]">Cancellation policy</p>
                                                <p className="mt-1 font-sans font-thin text-sm text-[#5a5a5a] whitespace-pre-line md:text-base">
                                                    {offer.cancellation_policy}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </section>
                        )}

                        {/* FAQs Section */}
                        {offer.faqs && offer.faqs.length > 0 && (
                            <section className="mb-10 border-t pt-8" id="faqs">
                                <h2 className="mb-6 text-xl font-thin uppercase text-[#2b2b2b] md:text-2xl">
                                    Frequently asked questions
                                </h2>
                                <div className="divide-y divide-gray-200 rounded-lg border border-gray-200">
                                    {offer.faqs.map((offerFaq) => (
                                        <details className="group" key={offerFaq.id}>
                                            <summary className="flex cursor-pointer items-center justify-between p-4 hover:bg-gray-50">
                                                <span className="font-sans font-light text-black pr-4">{offerFaq.faq.question}</span>
                                                <ChevronDown className="h-5 w-5 flex-shrink-0 text-[#5a5a5a] transition-transform group-open:rotate-180" />
                                            </summary>
                                            <div className="px-4 pb-4">
                                                <p className="font-sans text-sm font-thin leading-relaxed text-[#5a5a5a] md:text-base">{offerFaq.faq.answer}</p>
                                            </div>
                                        </details>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Right Column - Booking Card (Desktop only) */}
                    <div className="hidden lg:col-span-1 lg:block">
                        <OfferBookingCard
                            discountedPrice={offer.discounted_price}
                            discountPercentage={discountPercentage}
                            duration={offer.duration}
                            freeCancellation={offer.free_cancellation || false}
                            offerId={offer.id}
                            originalPrice={offer.original_price}
                            pricePer={offer.price_per || "person"}
                            rating={offer.rating}
                            reviewCount={offer.review_count}
                        />
                    </div>
                </div>

                {/* Related Experiences */}
                {relatedOffers.length > 0 && (
                    <section className="mt-16 border-t pt-12">
                        <h2 className="mb-2 font-serif text-2xl font-light tracking-[0.15em] uppercase text-[#2b2b2b] md:text-3xl">
                            You might also like
                        </h2>
                        <p className="mb-8 font-serif text-base text-[#5a5a5a] md:text-lg">
                            Other top experiences in {offer.location || "this area"}
                        </p>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {relatedOffers.map((relatedOffer) => (
                                <Link
                                    className="group block"
                                    href={`/offers/${relatedOffer.slug}`}
                                    key={relatedOffer.id}
                                >
                                    <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
                                        {relatedOffer.image && (
                                            <Image
                                                alt={relatedOffer.name}
                                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                                fill
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                                src={relatedOffer.image.original_url}
                                            />
                                        )}
                                        {relatedOffer.free_cancellation && (
                                            <div className="absolute left-2 top-2 rounded bg-white/90 px-2 py-1 text-xs font-medium text-gray-900 backdrop-blur-sm">
                                                Free cancellation
                                            </div>
                                        )}
                                    </div>
                                    <div className="mt-3">
                                        <h3 className="font-serif font-medium text-[#2b2b2b] line-clamp-2 group-hover:text-blue-600 md:text-lg">
                                            {relatedOffer.name}
                                        </h3>
                                        {relatedOffer.duration && (
                                            <p className="mt-1 font-serif text-sm text-[#5a5a5a] md:text-base">{relatedOffer.duration}</p>
                                        )}
                                        {relatedOffer.rating && (
                                            <div className="mt-2 flex items-center gap-1">
                                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                <span className="font-serif text-sm font-medium text-[#2b2b2b]">{relatedOffer.rating}</span>
                                                {relatedOffer.review_count && (
                                                    <span className="font-serif text-sm text-[#5a5a5a]">
                                                        ({relatedOffer.review_count})
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                        <div className="mt-2">
                                            {relatedOffer.discounted_price ? (
                                                <div className="flex items-baseline gap-2">
                                                    <span className="font-serif text-sm text-[#5a5a5a]">From</span>
                                                    <span className="font-serif font-bold text-[#2b2b2b]">
                                                        ₹{Number(relatedOffer.discounted_price).toLocaleString()}
                                                    </span>
                                                    {relatedOffer.original_price &&
                                                        Number(relatedOffer.original_price) > Number(relatedOffer.discounted_price) && (
                                                            <span className="font-serif text-sm text-[#5a5a5a] line-through">
                                                                ₹{Number(relatedOffer.original_price).toLocaleString()}
                                                            </span>
                                                        )}
                                                </div>
                                            ) : relatedOffer.original_price ? (
                                                <div className="flex items-baseline gap-2">
                                                    <span className="font-serif text-sm text-[#5a5a5a]">From</span>
                                                    <span className="font-serif font-bold text-[#2b2b2b]">
                                                        ₹{Number(relatedOffer.original_price).toLocaleString()}
                                                    </span>
                                                </div>
                                            ) : null}
                                            {relatedOffer.price_per && (
                                                <span className="font-serif text-sm text-[#5a5a5a]">per {relatedOffer.price_per}</span>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </div>

            {/* Mobile Sticky Booking Bar */}
            <MobileBookingBar
                discountedPrice={offer.discounted_price}
                discountPercentage={discountPercentage}
                offerId={offer.id}
                originalPrice={offer.original_price}
                pricePer={offer.price_per || "person"}
                rating={offer.rating}
                reviewCount={offer.review_count}
            />
        </main>
    );
}
