"use client";

import { Calendar, Clock, Shield, Star, Users } from "lucide-react";
import Link from "next/link";

interface OfferBookingCardProps {
    bookingLink: string;
    discountedPrice?: null | string;
    discountPercentage?: number;
    duration?: null | string;
    freeCancellation: boolean;
    originalPrice?: null | string;
    pricePer: string;
    rating?: null | string;
    reviewCount?: null | number;
}

export function OfferBookingCard({
    bookingLink,
    discountedPrice,
    discountPercentage = 0,
    duration,
    freeCancellation,
    originalPrice,
    pricePer,
    rating,
    reviewCount,
}: OfferBookingCardProps) {
    const displayPrice = discountedPrice || originalPrice;
    const hasDiscount = discountPercentage > 0;

    return (
        <div className="sticky top-24">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
                {/* Price Section */}
                <div className="mb-4">
                    <div className="flex items-baseline gap-2">
                        <span className="text-sm text-gray-600">From</span>
                    </div>
                    <div className="flex items-baseline gap-3">
                        {displayPrice && (
                            <span className="text-3xl font-bold text-gray-900">
                                ₹{Number(displayPrice).toLocaleString()}
                            </span>
                        )}
                        {hasDiscount && originalPrice && (
                            <span className="text-lg text-gray-400 line-through">
                                ₹{Number(originalPrice).toLocaleString()}
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-gray-600">per {pricePer}</p>

                    {hasDiscount && (
                        <div className="mt-2 inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-700">
                            Save {discountPercentage}%
                        </div>
                    )}
                </div>

                {/* Rating */}
                {rating && (
                    <div className="mb-4 flex items-center gap-2">
                        <div className="flex items-center gap-1 rounded bg-green-600 px-2 py-1">
                            <Star className="h-3.5 w-3.5 fill-white text-white" />
                            <span className="text-sm font-bold text-white">{rating}</span>
                        </div>
                        {reviewCount && reviewCount > 0 && (
                            <span className="text-sm text-gray-600">
                                {reviewCount.toLocaleString()} reviews
                            </span>
                        )}
                    </div>
                )}

                {/* Quick Info */}
                <div className="mb-6 space-y-2 border-t border-b border-gray-100 py-4">
                    {duration && (
                        <div className="flex items-center gap-3 text-sm">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span className="text-gray-700">{duration}</span>
                        </div>
                    )}
                    {freeCancellation && (
                        <div className="flex items-center gap-3 text-sm">
                            <Shield className="h-4 w-4 text-green-600" />
                            <span className="text-green-700">Free cancellation available</span>
                        </div>
                    )}
                </div>

                {/* CTA Button */}
                <Link
                    className="block w-full rounded-lg bg-blue-600 py-4 text-center text-lg font-semibold text-white transition-colors hover:bg-blue-700"
                    href={bookingLink}
                    target={bookingLink.startsWith("http") ? "_blank" : undefined}
                >
                    Check availability
                </Link>

                {/* Reserve Now Note */}
                <p className="mt-3 text-center text-sm text-gray-500">
                    Reserve now & pay later
                </p>

                {/* Features */}
                <div className="mt-6 space-y-3">
                    <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                            <Calendar className="h-3 w-3 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-900">Free cancellation</p>
                            <p className="text-xs text-gray-500">Cancel up to 24 hours in advance for a full refund</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                            <Users className="h-3 w-3 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-900">Skip the line</p>
                            <p className="text-xs text-gray-500">Beat the crowds with pre-booked tickets</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Help Section */}
            <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4 text-center">
                <p className="text-sm text-gray-600">Have a question?</p>
                <Link
                    className="mt-1 inline-block text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                    href="/contact-us"
                >
                    Contact us
                </Link>
            </div>
        </div>
    );
}
