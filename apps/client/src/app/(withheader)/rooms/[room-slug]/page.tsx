import { getRoomTypes } from "@repo/actions/room-types.actions";
import {
    BedDouble,
    Check,
    ChevronDown,
    ChevronRight,
    Maximize,
    Users,
    X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getActiveRoomTypesCache, getRoomTypeBySlugCache, getRoomTypesCache } from "@/lib/cache/rooms.cache";

import { RoomEnquiryCard } from "./components/RoomEnquiryCard";
import { RoomGallery } from "./components/RoomGallery";

type PageProps = {
    params: Promise<{ "room-slug": string }>;
};

export async function generateMetadata({ params }: PageProps) {
    const { "room-slug": roomSlug } = await params;
    const room = await getRoomTypeBySlugCache(roomSlug);

    if (!room) {
        return {
            title: "Room Not Found",
        };
    }

    return {
        description: room.description?.slice(0, 160),
        title: `${room.name} | Manu Maharani Resort & Spa`,
    };
}

export async function generateStaticParams() {
    const { roomTypes } = await getRoomTypes({ status: "active" });

    return roomTypes
        .filter((room) => room.slug)
        .map((room) => ({
            "room-slug": room.slug,
        }));
}

export default async function RoomDetailPage({ params }: PageProps) {
    const { "room-slug": roomSlug } = await params;
    const room = await getRoomTypeBySlugCache(roomSlug);

    if (!room) {
        notFound();
    }

    // Get all gallery images
    const galleryImages = room.images?.map((img) => img.image.original_url) || [];

    // Separate include/exclude policies
    const includePolicies = room.policies?.filter((p) => p.policy.kind === "include") || [];
    const excludePolicies = room.policies?.filter((p) => p.policy.kind === "exclude") || [];

    // Get other rooms for "Other accommodations" section
    const allRooms = await getActiveRoomTypesCache();
    const otherRooms = allRooms.filter((r) => r.id !== room.id).slice(0, 4);

    return (
        <main className="min-h-screen bg-white">
            {/* Breadcrumb */}
            <div className="border-b border-b-gray-200 bg-gray-50">
                <div className="mx-auto max-w-screen-xl px-4 py-3">
                    <nav className="flex items-center gap-2 text-sm">
                        <Link className="font-serif text-sm text-[#5a5a5a] hover:text-[#2b2b2b] hover:underline" href="/">
                            Home
                        </Link>
                        <ChevronRight className="h-4 w-4 text-[#5a5a5a]" />
                        <Link className="font-serif text-sm text-[#5a5a5a] hover:text-[#2b2b2b] hover:underline" href="/rooms">
                            Accommodation
                        </Link>
                        <ChevronRight className="h-4 w-4 text-[#5a5a5a]" />
                        <span className="line-clamp-1 font-serif text-sm font-medium text-[#2b2b2b]">{room.name}</span>
                    </nav>
                </div>
            </div>

            {/* Gallery Section */}
            <RoomGallery images={galleryImages} title={room.name} />

            {/* Main Content */}
            <div className="mx-auto max-w-screen-xl px-4 py-8">
                <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
                    {/* Left Column - Details */}
                    <div className="lg:col-span-2">
                        {/* Title Section */}
                        <div className="mb-6">
                            <h1 className="mb-3 font-thin tracking-widest text-2xl leading-tight text-[#2b2b2b] md:text-4xl lg:text-4xl">
                                {room.name.toUpperCase()}
                            </h1>

                            {/* Location */}
                            <p className="font-serif text-sm text-[#5a5a5a] md:text-base">
                                Manu Maharani Resort & Spa, Jim Corbett
                            </p>
                        </div>

                        {/* Key Info Pills */}
                        <div className="mb-8 flex flex-wrap gap-3">
                            <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-2">
                                <Users className="h-4 w-4 text-[#5a5a5a]" />
                                <span className="font-serif text-sm text-[#5a5a5a]">Up to {room.max_occupancy} guests</span>
                            </div>
                            <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-2">
                                <Maximize className="h-4 w-4 text-[#5a5a5a]" />
                                <span className="font-serif text-sm text-[#5a5a5a]">{room.size_sqft} sq ft</span>
                            </div>
                            <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-2">
                                <BedDouble className="h-4 w-4 text-[#5a5a5a]" />
                                <span className="font-serif text-sm capitalize text-[#5a5a5a]">
                                    {room.number_of_beds} {room.bed_type} {room.number_of_beds > 1 ? "beds" : "bed"}
                                </span>
                            </div>
                        </div>

                        {/* About This Room */}
                        <section className="mb-10 border-t pt-8" id="about">
                            <h2 className="mb-4 font-thin tracking-widest text-xl uppercase text-[#2b2b2b] md:text-2xl">
                                About this room
                            </h2>
                            <div className="prose prose-gray max-w-none">
                                <p className="whitespace-pre-line font-serif text-base leading-relaxed text-[#5a5a5a] md:text-lg">
                                    {room.description}
                                </p>
                            </div>
                        </section>

                        {/* Amenities Section */}
                        {room.amenities && room.amenities.length > 0 && (
                            <section className="mb-10 border-t pt-8" id="amenities">
                                <h2 className="mb-6 font-thin tracking-widest text-xl uppercase text-[#2b2b2b] md:text-2xl">
                                    Amenities
                                </h2>
                                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                                    {room.amenities.map((roomAmenity) => (
                                        <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3" key={roomAmenity.id}>
                                            <span className="text-xl">{roomAmenity.amenity.icon}</span>
                                            <div>
                                                <span className="font-serif text-sm font-medium text-[#2b2b2b]">
                                                    {roomAmenity.amenity.label}
                                                </span>
                                                {roomAmenity.amenity.description && (
                                                    <p className="font-serif text-xs text-[#5a5a5a]">
                                                        {roomAmenity.amenity.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Policies Section */}
                        {(includePolicies.length > 0 || excludePolicies.length > 0) && (
                            <section className="mb-10 border-t pt-8" id="policies">
                                <h2 className="mb-6 font-thin tracking-widest text-xl uppercase text-[#2b2b2b] md:text-2xl">
                                    Room policies
                                </h2>
                                <div className="grid gap-8 md:grid-cols-2">
                                    {includePolicies.length > 0 && (
                                        <div>
                                            <ul className="space-y-3">
                                                {includePolicies.map((roomPolicy) => (
                                                    <li className="flex items-start gap-3" key={roomPolicy.id}>
                                                        <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-green-100">
                                                            <Check className="h-3 w-3 text-green-600" />
                                                        </div>
                                                        <div>
                                                            <span className="font-serif text-base text-[#2b2b2b] md:text-lg">{roomPolicy.policy.label}</span>
                                                            {roomPolicy.policy.description && (
                                                                <p className="font-serif text-sm text-[#5a5a5a]">{roomPolicy.policy.description}</p>
                                                            )}
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    {excludePolicies.length > 0 && (
                                        <div>
                                            <ul className="space-y-3">
                                                {excludePolicies.map((roomPolicy) => (
                                                    <li className="flex items-start gap-3" key={roomPolicy.id}>
                                                        <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
                                                            <X className="h-3 w-3 text-red-600" />
                                                        </div>
                                                        <div>
                                                            <span className="font-serif text-base text-[#2b2b2b] md:text-lg">{roomPolicy.policy.label}</span>
                                                            {roomPolicy.policy.description && (
                                                                <p className="font-serif text-sm text-[#5a5a5a]">{roomPolicy.policy.description}</p>
                                                            )}
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </section>
                        )}

                        {/* FAQs Section */}
                        {room.faqs && room.faqs.length > 0 && (
                            <section className="mb-10 border-t pt-8" id="faqs">
                                <h2 className="mb-6 font-thin tracking-widest text-xl uppercase text-[#2b2b2b] md:text-2xl">
                                    Frequently asked questions
                                </h2>
                                <div className="divide-y divide-gray-200 rounded-lg border border-gray-200">
                                    {room.faqs.map((roomFaq) => (
                                        <details className="group" key={roomFaq.id}>
                                            <summary className="flex cursor-pointer items-center justify-between p-4 hover:bg-gray-50">
                                                <span className="pr-4 font-serif font-bold text-black">{roomFaq.faq.question}</span>
                                                <ChevronDown className="h-5 w-5 flex-shrink-0 text-[#5a5a5a] transition-transform group-open:rotate-180" />
                                            </summary>
                                            <div className="px-4 pb-4">
                                                <p className="font-serif text-sm text-[#5a5a5a] md:text-base">{roomFaq.faq.answer}</p>
                                            </div>
                                        </details>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Right Column - Enquiry Card */}
                    <div className="lg:col-span-1">
                        <RoomEnquiryCard
                            basePrice={room.base_price}
                            bedType={room.bed_type}
                            maxOccupancy={room.max_occupancy}
                            numberOfBeds={room.number_of_beds}
                            peakSeasonPrice={room.peak_season_price}
                            sizeSqft={room.size_sqft}
                            weekendPrice={room.weekend_price}
                        />
                    </div>
                </div>

                {/* Other Accommodations */}
                {otherRooms.length > 0 && (
                    <section className="mt-16 border-t pt-12">
                        <h2 className="mb-2 font-serif text-2xl font-light tracking-[0.15em] uppercase text-[#2b2b2b] md:text-3xl">
                            Other accommodations
                        </h2>
                        <p className="mb-8 font-serif text-base text-[#5a5a5a] md:text-lg">
                            Explore more rooms and cottages at Manu Maharani
                        </p>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {otherRooms.map((otherRoom) => {
                                const firstImage = otherRoom.images?.[0]?.image?.original_url;
                                return (
                                    <Link
                                        className="group block"
                                        href={`/rooms/${otherRoom.slug}`}
                                        key={otherRoom.id}
                                    >
                                        <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
                                            {firstImage ? (
                                                <Image
                                                    alt={otherRoom.name}
                                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                                    fill
                                                    src={firstImage}
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center bg-gray-100">
                                                    <span className="text-sm text-gray-400">No image</span>
                                                </div>
                                            )}
                                            {otherRoom.base_price && Number(otherRoom.base_price) > 0 && (
                                                <div className="absolute bottom-2 right-2 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#2b2b2b] backdrop-blur-sm">
                                                    From ₹{Number(otherRoom.base_price).toLocaleString("en-IN")}
                                                </div>
                                            )}
                                        </div>
                                        <div className="mt-3">
                                            <h3 className="font-serif font-medium text-[#2b2b2b] line-clamp-2 group-hover:text-[#b68833] md:text-lg">
                                                {otherRoom.name}
                                            </h3>
                                            <div className="mt-1 flex items-center gap-3 text-sm text-[#5a5a5a]">
                                                <span>Up to {otherRoom.max_occupancy} guests</span>
                                                <span>{otherRoom.size_sqft} sq ft</span>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </section>
                )}
            </div>
        </main>
    );
}
