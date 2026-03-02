import { BedDouble, ExternalLink, Maximize, Users } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

interface RoomBookingCardProps {
    basePrice: string;
    bedType: string;
    bookingUrl: string;
    maxOccupancy: number;
    numberOfBeds: number;
    peakSeasonPrice?: null | string;
    sizeSqft: number;
    weekendPrice?: null | string;
}

export function RoomBookingCard({
    basePrice,
    bedType,
    bookingUrl,
    maxOccupancy,
    numberOfBeds,
    peakSeasonPrice,
    sizeSqft,
    weekendPrice,
}: RoomBookingCardProps) {
    const hasBasePrice = basePrice && Number(basePrice) > 0;

    return (
        <div className="sticky top-24">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
                {/* Price Section */}
                {hasBasePrice && (
                    <div className="mb-4">
                        <div className="flex items-baseline gap-2">
                            <span className="text-sm text-gray-600">Starting from</span>
                        </div>
                        <div className="flex items-baseline gap-3">
                            <span className="text-3xl font-bold text-gray-900">
                                ₹{Number(basePrice).toLocaleString("en-IN")}
                            </span>
                        </div>
                        <p className="text-sm text-gray-600">per night</p>
                    </div>
                )}

                {/* Room Specs */}
                <div className="mb-6 space-y-3 border-b border-t border-gray-100 py-4">
                    <div className="flex items-center gap-3 text-sm">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-700">Up to {maxOccupancy} guests</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                        <Maximize className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-700">{sizeSqft} sq ft</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                        <BedDouble className="h-4 w-4 text-gray-500" />
                        <span className="capitalize text-gray-700">
                            {numberOfBeds} {bedType} {numberOfBeds > 1 ? "beds" : "bed"}
                        </span>
                    </div>
                </div>

                {/* Pricing Tiers */}
                {(weekendPrice || peakSeasonPrice) && (
                    <div className="mb-6 space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Pricing</p>
                        {hasBasePrice && (
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Weekday</span>
                                <span className="font-medium text-gray-900">₹{Number(basePrice).toLocaleString("en-IN")}</span>
                            </div>
                        )}
                        {weekendPrice && Number(weekendPrice) > 0 && (
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Weekend</span>
                                <span className="font-medium text-gray-900">₹{Number(weekendPrice).toLocaleString("en-IN")}</span>
                            </div>
                        )}
                        {peakSeasonPrice && Number(peakSeasonPrice) > 0 && (
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Peak Season</span>
                                <span className="font-medium text-gray-900">₹{Number(peakSeasonPrice).toLocaleString("en-IN")}</span>
                            </div>
                        )}
                    </div>
                )}

                {/* Book Now Button */}
                <Link href={bookingUrl} passHref
                    rel="noopener noreferrer"
                    target="_blank">
                    <Button
                        className="w-full"

                    >
                        Book Now
                        <ExternalLink className="h-4 w-4" />
                    </Button></Link>

                <p className="mt-3 text-center text-sm text-gray-500">
                    Best rate guaranteed when you book directly
                </p>
            </div>

            {/* Help Section */}
            <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4 text-center">
                <p className="text-sm text-gray-600">Need help choosing?</p>
                <Link
                    className="mt-1 inline-block text-sm font-semibold text-[#b68833] hover:text-[#a07628] hover:underline"
                    href="/contact-us"
                >
                    Contact us
                </Link>
            </div>
        </div>
    );
}
