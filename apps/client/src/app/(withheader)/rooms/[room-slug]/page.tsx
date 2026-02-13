import { getActiveRooms } from "@repo/actions/rooms.actions";
import {
    BedDouble,
    ChevronRight,
    Maximize,
    Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { RenderIcon } from "@/components/render-icon";
import { getActiveRoomsCache, getRoomBySlugCache } from "@/lib/cache/rooms.cache";

import { MobileBookingBar } from "./components/MobileBookingBar";
import { RoomBookingCard } from "./components/RoomBookingCard";
import { RoomGallery } from "./components/RoomGallery";


export async function generateMetadata({ params }: PageProps<"/rooms/[room-slug]">) {
    const { "room-slug": roomSlug } = await params;
    const room = await getRoomBySlugCache(roomSlug);

    if (!room) {
        return {
            title: "Room Not Found",
        };
    }

    return {
        description: room.description?.slice(0, 160),
        title: `${room.title} | Manu Maharani Resort & Spa`,
    };
}

export async function generateStaticParams() {
    const rooms = await getActiveRooms();

    return rooms
        .filter((room) => room.slug)
        .map((room) => ({
            "room-slug": room.slug,
        }));
}

export default async function RoomDetailPage({ params }: PageProps<"/rooms/[room-slug]">) {
    const { "room-slug": roomSlug } = await params;
    const room = await getRoomBySlugCache(roomSlug);

    if (!room) {
        notFound();
    }

    // Get all gallery images
    const galleryImages = room.images?.map((img: { image: { original_url: string } }) => img.image.original_url) || [];

    const bookingUrl = process.env.BOOKING_URL || "#";

    // Get other rooms for "Other accommodations" section
    const allRooms = await getActiveRoomsCache();
    const otherRooms = allRooms.filter((r) => r.id !== room.id).slice(0, 4);

    return (
        <main className="min-h-screen bg-background pb-20 pt-[72px] md:pt-[88px] lg:pb-0">
            {/* Breadcrumb */}
            <div className="border-b border-b-gray-200 ">
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
                        <span className="line-clamp-1 font-serif text-sm font-medium text-[#2b2b2b]">{room.title}</span>
                    </nav>
                </div>
            </div>

            {/* Gallery Section */}
            <RoomGallery images={galleryImages} title={room.title} />

            {/* Main Content */}
            <div className="mx-auto max-w-screen-xl px-4 py-8">
                <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
                    {/* Left Column - Details */}
                    <div className="lg:col-span-2">
                        {/* Title Section */}
                        <div className="mb-6">
                            <h1 className="mb-3 font-thin tracking-widest text-2xl leading-tight text-[#2b2b2b] md:text-4xl lg:text-4xl">
                                {room.title.toUpperCase()}
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
                                    {room.amenities.map((roomAmenity: { amenity: { description?: null | string; icon: string; label: string }; id: number }) => (
                                        <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3" key={roomAmenity.id}>
                                            <RenderIcon className="text-[#5a5a5a]" name={roomAmenity.amenity.icon} size={20} />
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

                        {/* Policies Section - Check-in/out, children, extra beds */}
                        {(room.check_in_time || room.check_out_time || room.children_policy || room.extra_beds) && (
                            <section className="mb-10 border-t pt-8" id="policies">
                                <h2 className="mb-6 font-thin tracking-widest text-xl uppercase text-[#2b2b2b] md:text-2xl">
                                    Room policies
                                </h2>
                                <div className="space-y-4">
                                    {(room.check_in_time || room.check_out_time) && (
                                        <div className="flex flex-wrap gap-6">
                                            {room.check_in_time && (
                                                <div>
                                                    <p className="text-xs font-semibold uppercase tracking-wider text-[#5a5a5a]">Check-in</p>
                                                    <p className="font-serif text-base text-[#2b2b2b]">{room.check_in_time}</p>
                                                </div>
                                            )}
                                            {room.check_out_time && (
                                                <div>
                                                    <p className="text-xs font-semibold uppercase tracking-wider text-[#5a5a5a]">Check-out</p>
                                                    <p className="font-serif text-base text-[#2b2b2b]">{room.check_out_time}</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    {room.children_policy && (
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-wider text-[#5a5a5a]">Children policy</p>
                                            <p className="font-serif text-sm text-[#2b2b2b] md:text-base">{room.children_policy}</p>
                                        </div>
                                    )}
                                    {room.extra_beds && (
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-wider text-[#5a5a5a]">Extra beds</p>
                                            <p className="font-serif text-sm text-[#2b2b2b] md:text-base">{room.extra_beds}</p>
                                        </div>
                                    )}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Right Column - Booking Card (Desktop Only) */}
                    <div className="hidden lg:col-span-1 lg:block">
                        <RoomBookingCard
                            basePrice={room.base_price}
                            bedType={room.bed_type}
                            bookingUrl={bookingUrl}
                            maxOccupancy={room.max_occupancy}
                            numberOfBeds={room.number_of_beds}
                            sizeSqft={room.size_sqft}
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
                                const featuredImage = otherRoom.image?.original_url;
                                const firstGalleryImage = otherRoom.images?.[0]?.image?.original_url;
                                const displayImage = featuredImage || firstGalleryImage;
                                return (
                                    <Link
                                        className="group block"
                                        href={`/rooms/${otherRoom.slug}`}
                                        key={otherRoom.id}
                                    >
                                        <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
                                            {displayImage ? (
                                                <Image
                                                    alt={otherRoom.title}
                                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                                    fill
                                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                                    src={displayImage}
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
                                                {otherRoom.title}
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

            {/* Mobile Booking Bar */}
            <MobileBookingBar
                basePrice={room.base_price}
                bookingUrl={bookingUrl}
            />
        </main>
    );
}
