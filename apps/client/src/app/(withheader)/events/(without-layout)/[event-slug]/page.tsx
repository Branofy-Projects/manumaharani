import { getRelatedEvents } from "@repo/actions/events.actions";
import {
    Calendar,
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
import { getEventBySlugCache, getEventsCache } from "@/lib/cache/events.cache";

import { OfferGallery } from "../../../offers/(with-layout)/[offer-slug]/components/OfferGallery";
import { OfferItinerarySection } from "../../../offers/(with-layout)/[offer-slug]/components/OfferItinerarySection";
import { EventBookingCard } from "./components/EventBookingCard";
import { MobileBookingBar } from "./components/MobileBookingBar";

type PageProps = {
    params: Promise<{ "event-slug": string }>;
};

export default async function EventDetailPage({ params }: PageProps) {
    const { "event-slug": eventSlug } = await params;
    const event = await getEventBySlugCache(eventSlug);

    if (!event) {
        notFound();
    }

    const relatedEvents = await getRelatedEvents(event.id, event.category, 4);

    let languages: string[] = [];
    try {
        languages = event.languages ? JSON.parse(event.languages) : [];
    } catch {
        languages = event.languages ? [event.languages] : [];
    }

    const includedHighlights = event.highlights?.filter((h) => h.type === "included") || [];
    const excludedHighlights = event.highlights?.filter((h) => h.type === "excluded") || [];

    const galleryImages = [
        ...(event.image ? [event.image.original_url] : []),
        ...(event.images?.map((img) => img.image.original_url) || []),
    ];

    const hasDiscount =
        event.original_price &&
        event.discounted_price &&
        Number(event.original_price) > Number(event.discounted_price);
    const discountPercentage = hasDiscount
        ? Math.round(
            ((Number(event.original_price) - Number(event.discounted_price)) /
                Number(event.original_price)) *
            100
        )
        : 0;

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
                        <Link className="font-sans font-light text-sm text-[#5a5a5a] hover:text-[#2b2b2b] hover:underline" href="/events">
                            Events
                        </Link>
                        <ChevronRight className="h-4 w-4 text-[#5a5a5a]" />
                        <span className="font-sans font-light text-sm text-[#2b2b2b] line-clamp-1">{event.name}</span>
                    </nav>
                </div>
            </div>

            {/* Gallery Section */}
            <OfferGallery images={galleryImages} title={event.name} />

            {/* Main Content */}
            <div className="mx-auto max-w-screen-xl px-4 py-8">
                <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
                    {/* Left Column - Details */}
                    <div className="lg:col-span-2">
                        {/* Title Section */}
                        <div className="mb-6">
                            <h1 className="mb-3 font-thin tracking-widest text-2xl leading-tight text-[#2b2b2b] md:text-4xl lg:text-4xl">
                                {event.name.toUpperCase()}
                            </h1>

                            <div className="flex flex-wrap items-center gap-3">
                                {event.rating && (
                                    <div className="flex items-center gap-1.5">
                                        <div className="flex items-center gap-0.5 rounded bg-green-600 px-1.5 py-0.5">
                                            <Star className="h-3.5 w-3.5 fill-white text-white" />
                                            <span className="text-sm font-bold text-white">{event.rating}</span>
                                        </div>
                                        {event.review_count && event.review_count > 0 && (
                                            <span className="text-sm text-gray-600">
                                                {event.review_count.toLocaleString()} reviews
                                            </span>
                                        )}
                                    </div>
                                )}
                                {event.location && (
                                    <div className="flex items-center gap-1 font-serif text-sm text-[#5a5a5a]">
                                        <MapPin className="h-4 w-4" />
                                        <span>{event.location}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Key Info Pills */}
                        <div className="mb-8 flex flex-wrap gap-3">
                            {/* Event Date */}
                            <div className="flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2">
                                <Calendar className="h-4 w-4 text-blue-600" />
                                <span className="font-serif text-sm font-medium text-blue-700">
                                    {formatEventDate(event.startDate, event.endDate)}
                                </span>
                            </div>
                            {/* Event Time */}
                            <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-2">
                                <Clock className="h-4 w-4 text-[#5a5a5a]" />
                                <span className="font-serif text-sm text-[#5a5a5a]">
                                    {event.startTime}{event.endTime ? ` - ${event.endTime}` : ""}
                                </span>
                            </div>
                            {event.free_cancellation && (
                                <div className="flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-2">
                                    <Shield className="h-4 w-4 text-green-600" />
                                    <span className="font-serif text-sm font-medium text-green-700">Free cancellation</span>
                                </div>
                            )}
                            {event.duration && (
                                <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-2">
                                    <Clock className="h-4 w-4 text-[#5a5a5a]" />
                                    <span className="font-serif text-sm text-[#5a5a5a]">{event.duration}</span>
                                </div>
                            )}
                            {event.max_group_size && (
                                <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-2">
                                    <Users className="h-4 w-4 text-[#5a5a5a]" />
                                    <span className="font-serif text-sm text-[#5a5a5a]">Max {event.max_group_size} people</span>
                                </div>
                            )}
                            {languages.length > 0 && (
                                <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-2">
                                    <Globe className="h-4 w-4 text-[#5a5a5a]" />
                                    <span className="font-serif text-sm text-[#5a5a5a]">{languages.join(", ")}</span>
                                </div>
                            )}
                        </div>

                        {/* About This Event */}
                        <section className="mb-10 border-t pt-8" id="about">
                            <h2 className="mb-4 font-thin tracking-widest text-xl uppercase text-[#2b2b2b] md:text-2xl">
                                About this event
                            </h2>
                            <div className="prose prose-gray max-w-none">
                                <LexicalRenderer content={event.description} />
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

                        {/* Itinerary */}
                        {event.itinerary && event.itinerary.length > 0 && (
                            <section className="mb-10 border-t pt-8" id="itinerary">
                                <OfferItinerarySection itinerary={event.itinerary as any} />
                            </section>
                        )}

                        {/* Additional Info Section */}
                        {(event.booking_notice || event.cancellation_policy) && (
                            <section className="mb-10 border-t pt-8" id="additional-info">
                                <h2 className="mb-6 text-xl font-thin uppercase text-[#2b2b2b] md:text-2xl">
                                    Additional information
                                </h2>

                                {event.booking_notice && (
                                    <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
                                        <div className="flex gap-3">
                                            <Info className="h-5 w-5 flex-shrink-0 text-amber-700" />
                                            <div>
                                                <p className="font-sans font-light text-amber-700">Important information</p>
                                                <p className="mt-1 font-sans font-thin text-sm text-amber-700 md:text-base">{event.booking_notice}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {event.cancellation_policy && (
                                    <div className="rounded-lg border border-gray-200 p-4">
                                        <div className="flex gap-3">
                                            <Ticket className="h-5 w-5 flex-shrink-0 text-gray-600" />
                                            <div>
                                                <p className="font-sans font-light text-[#2b2b2b]">Cancellation policy</p>
                                                <p className="mt-1 font-sans font-thin text-sm text-[#5a5a5a] whitespace-pre-line md:text-base">
                                                    {event.cancellation_policy}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </section>
                        )}

                        {/* FAQs Section */}
                        {event.faqs && event.faqs.length > 0 && (
                            <section className="mb-10 border-t pt-8" id="faqs">
                                <h2 className="mb-6 text-xl font-thin uppercase text-[#2b2b2b] md:text-2xl">
                                    Frequently asked questions
                                </h2>
                                <div className="divide-y divide-gray-200 rounded-lg border border-gray-200">
                                    {event.faqs.map((eventFaq) => (
                                        <details className="group" key={eventFaq.id}>
                                            <summary className="flex cursor-pointer items-center justify-between p-4 hover:bg-gray-50">
                                                <span className="font-sans font-light text-black pr-4">{eventFaq.faq.question}</span>
                                                <ChevronDown className="h-5 w-5 flex-shrink-0 text-[#5a5a5a] transition-transform group-open:rotate-180" />
                                            </summary>
                                            <div className="px-4 pb-4">
                                                <p className="font-sans text-sm font-thin leading-relaxed text-[#5a5a5a] md:text-base">{eventFaq.faq.answer}</p>
                                            </div>
                                        </details>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Right Column - Booking Card (Desktop only) */}
                    <div className="hidden lg:col-span-1 lg:block">
                        <EventBookingCard
                            discountedPrice={event.discounted_price}
                            discountPercentage={discountPercentage}
                            duration={event.duration}
                            endDate={event.endDate}
                            endTime={event.endTime}
                            eventId={event.id}
                            freeCancellation={event.free_cancellation || false}
                            originalPrice={event.original_price}
                            pricePer={event.price_per || "person"}
                            rating={event.rating}
                            reviewCount={event.review_count}
                            startDate={event.startDate}
                            startTime={event.startTime}
                        />
                    </div>
                </div>

                {/* Related Events */}
                {relatedEvents.length > 0 && (
                    <section className="mt-16 border-t pt-12">
                        <h2 className="mb-2 font-serif text-2xl font-light tracking-[0.15em] uppercase text-[#2b2b2b] md:text-3xl">
                            You might also like
                        </h2>
                        <p className="mb-8 font-serif text-base text-[#5a5a5a] md:text-lg">
                            Other upcoming events at {event.location || "Manu Maharani"}
                        </p>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {relatedEvents.map((relatedEvent) => (
                                <Link
                                    className="group block"
                                    href={`/events/${relatedEvent.slug}`}
                                    key={relatedEvent.id}
                                >
                                    <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
                                        {relatedEvent.image && (
                                            <Image
                                                alt={relatedEvent.name}
                                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                                fill
                                                src={relatedEvent.image.original_url}
                                            />
                                        )}
                                        {/* Date badge */}
                                        <div className="absolute top-2 left-2 rounded bg-white/90 px-2 py-1 backdrop-blur-sm">
                                            <span className="text-xs font-medium text-gray-900">
                                                {new Date(relatedEvent.startDate + "T00:00:00").toLocaleDateString("en-US", { day: "numeric", month: "short" })}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mt-3">
                                        <h3 className="font-serif font-medium text-[#2b2b2b] line-clamp-2 group-hover:text-blue-600 md:text-lg">
                                            {relatedEvent.name}
                                        </h3>
                                        <p className="mt-1 font-serif text-sm text-[#5a5a5a]">
                                            {relatedEvent.startTime}{relatedEvent.endTime ? ` - ${relatedEvent.endTime}` : ""}
                                        </p>
                                        {relatedEvent.rating && (
                                            <div className="mt-2 flex items-center gap-1">
                                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                <span className="font-serif text-sm font-medium text-[#2b2b2b]">{relatedEvent.rating}</span>
                                                {relatedEvent.review_count && (
                                                    <span className="font-serif text-sm text-[#5a5a5a]">
                                                        ({relatedEvent.review_count})
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                        <div className="mt-2">
                                            {relatedEvent.discounted_price ? (
                                                <div className="flex items-baseline gap-2">
                                                    <span className="font-serif text-sm text-[#5a5a5a]">From</span>
                                                    <span className="font-serif font-bold text-[#2b2b2b]">
                                                        ₹{Number(relatedEvent.discounted_price).toLocaleString()}
                                                    </span>
                                                    {relatedEvent.original_price &&
                                                        Number(relatedEvent.original_price) > Number(relatedEvent.discounted_price) && (
                                                            <span className="font-serif text-sm text-[#5a5a5a] line-through">
                                                                ₹{Number(relatedEvent.original_price).toLocaleString()}
                                                            </span>
                                                        )}
                                                </div>
                                            ) : relatedEvent.original_price ? (
                                                <div className="flex items-baseline gap-2">
                                                    <span className="font-serif text-sm text-[#5a5a5a]">From</span>
                                                    <span className="font-serif font-bold text-[#2b2b2b]">
                                                        ₹{Number(relatedEvent.original_price).toLocaleString()}
                                                    </span>
                                                </div>
                                            ) : null}
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
                discountedPrice={event.discounted_price}
                discountPercentage={discountPercentage}
                eventId={event.id}
                originalPrice={event.original_price}
                pricePer={event.price_per || "person"}
                rating={event.rating}
                reviewCount={event.review_count}
            />
        </main>
    );
}

export async function generateMetadata({ params }: PageProps) {
    const { "event-slug": eventSlug } = await params;
    const event = await getEventBySlugCache(eventSlug);

    if (!event) {
        return { title: "Event Not Found" };
    }

    return {
        description: event.meta_description || event.excerpt,
        openGraph: {
            description: event.meta_description || event.excerpt,
            images: event.image ? [event.image.original_url] : [],
            title: event.meta_title || event.name,
        },
        title: event.meta_title || event.name,
    };
}

export async function generateStaticParams() {
    const { events } = await getEventsCache();

    return events
        .filter((event) => event.slug)
        .map((event) => ({
            "event-slug": event.slug,
        }));
}

function formatEventDate(startDate: string, endDate?: null | string) {
    const start = new Date(startDate + "T00:00:00");
    const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" };
    if (endDate && endDate !== startDate) {
        const end = new Date(endDate + "T00:00:00");
        return `${start.toLocaleDateString("en-US", opts)} - ${end.toLocaleDateString("en-US", opts)}`;
    }
    return start.toLocaleDateString("en-US", opts);
}
