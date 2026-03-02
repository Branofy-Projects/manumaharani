"use client";

import { createEventBooking } from "@repo/actions/event-bookings.actions";
import { Calendar, CheckCircle, Clock, Loader2, Minus, Plus, Shield, Star, XCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const bookingFormSchema = z.object({
    email: z.string().min(1, "Email is required").email("Please enter a valid email"),
    message: z.string().min(1, "Message is required").min(10, "Message must be at least 10 characters"),
    name: z.string().min(1, "Name is required").min(2, "Name must be at least 2 characters"),
    number_of_guests: z.number().min(1, "At least 1 guest is required").max(50, "Maximum 50 guests allowed"),
    phone: z.string().min(1, "Phone is required").min(10, "Phone must be at least 10 digits"),
});

interface EventBookingCardProps {
    discountedPrice?: null | string;
    discountPercentage?: number;
    duration?: null | string;
    endDate?: null | string;
    endTime?: null | string;
    eventId: string;
    freeCancellation: boolean;
    originalPrice?: null | string;
    pricePer: string;
    rating?: null | string;
    reviewCount?: null | number;
    startDate: string;
    startTime: string;
}

type FormErrors = Partial<Record<keyof z.infer<typeof bookingFormSchema>, string>>;

export function EventBookingCard({
    discountedPrice,
    discountPercentage = 0,
    duration,
    endDate,
    endTime,
    eventId,
    freeCancellation,
    originalPrice,
    pricePer,
    rating,
    reviewCount,
    startDate,
    startTime,
}: EventBookingCardProps) {
    const displayPrice = discountedPrice || originalPrice;
    const hasDiscount = discountPercentage > 0;

    const [formData, setFormData] = useState({
        email: "",
        message: "",
        name: "",
        number_of_guests: 1,
        phone: "",
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [status, setStatus] = useState<"error" | "idle" | "submitting" | "success">("idle");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name as keyof FormErrors]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const result = bookingFormSchema.safeParse(formData);
        if (!result.success) {
            const fieldErrors: FormErrors = {};
            for (const issue of result.error.issues) {
                const field = issue.path[0] as keyof FormErrors;
                if (!fieldErrors[field]) {
                    fieldErrors[field] = issue.message;
                }
            }
            setErrors(fieldErrors);
            return;
        }

        setStatus("submitting");
        setErrors({});

        try {
            await createEventBooking({
                ...result.data,
                event_id: eventId,
            });
            setStatus("success");
        } catch {
            setStatus("error");
        }
    };

    const resetForm = () => {
        setFormData({ email: "", message: "", name: "", number_of_guests: 1, phone: "" });
        setErrors({});
        setStatus("idle");
    };

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
                    <div className="flex items-center gap-3 text-sm">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-700">{formatEventDate(startDate, endDate)}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-700">
                            {startTime}{endTime ? ` - ${endTime}` : ""}
                            {duration ? ` (${duration})` : ""}
                        </span>
                    </div>
                    {freeCancellation && (
                        <div className="flex items-center gap-3 text-sm">
                            <Shield className="h-4 w-4 text-green-600" />
                            <span className="text-green-700">Free cancellation available</span>
                        </div>
                    )}
                </div>

                {/* Success State */}
                {status === "success" && (
                    <div className="py-6 text-center">
                        <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                        <h3 className="mt-3 text-lg font-semibold text-gray-900">Booking Request Sent!</h3>
                        <p className="mt-1 text-sm text-gray-600">
                            We&apos;ll get back to you shortly with confirmation details.
                        </p>
                        <Button
                            className="mt-4 w-full rounded-lg"
                            onClick={resetForm}
                            variant="outline"
                        >
                            Submit another request
                        </Button>
                    </div>
                )}

                {/* Error State */}
                {status === "error" && (
                    <div className="py-6 text-center">
                        <XCircle className="mx-auto h-12 w-12 text-red-500" />
                        <h3 className="mt-3 text-lg font-semibold text-gray-900">Something went wrong</h3>
                        <p className="mt-1 text-sm text-gray-600">
                            We couldn&apos;t process your request. Please try again.
                        </p>
                        <Button
                            className="mt-4 w-full rounded-lg"
                            onClick={() => setStatus("idle")}
                            variant="outline"
                        >
                            Try again
                        </Button>
                    </div>
                )}

                {/* Booking Form */}
                {(status === "idle" || status === "submitting") && (
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <Label className="text-gray-700" htmlFor="name">Full Name</Label>
                            <Input
                                aria-invalid={!!errors.name}
                                className="mt-1 bg-white placeholder:text-gray-400"
                                id="name"
                                name="name"
                                onChange={handleInputChange}
                                placeholder="Your full name"
                                value={formData.name}
                            />
                            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                        </div>

                        <div>
                            <Label className="text-gray-700" htmlFor="email">Email</Label>
                            <Input
                                aria-invalid={!!errors.email}
                                className="mt-1 bg-white placeholder:text-gray-400"
                                id="email"
                                name="email"
                                onChange={handleInputChange}
                                placeholder="your@email.com"
                                type="email"
                                value={formData.email}
                            />
                            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                        </div>

                        <div>
                            <Label className="text-gray-700" htmlFor="phone">Phone</Label>
                            <Input
                                aria-invalid={!!errors.phone}
                                className="mt-1 bg-white placeholder:text-gray-400"
                                id="phone"
                                name="phone"
                                onChange={handleInputChange}
                                placeholder="+91 98765 43210"
                                type="tel"
                                value={formData.phone}
                            />
                            {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                        </div>

                        <div>
                            <Label className="text-gray-700">Number of Guests</Label>
                            <div className="mt-1 flex items-center gap-3">
                                <button
                                    className="flex h-9 w-9 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-50"
                                    disabled={formData.number_of_guests <= 1}
                                    onClick={() => {
                                        setFormData((prev) => ({ ...prev, number_of_guests: Math.max(1, prev.number_of_guests - 1) }));
                                        if (errors.number_of_guests) setErrors((prev) => ({ ...prev, number_of_guests: undefined }));
                                    }}
                                    type="button"
                                >
                                    <Minus className="h-4 w-4" />
                                </button>
                                <span className="min-w-8 text-center text-sm font-medium text-gray-900">
                                    {formData.number_of_guests}
                                </span>
                                <button
                                    className="flex h-9 w-9 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-50"
                                    disabled={formData.number_of_guests >= 50}
                                    onClick={() => {
                                        setFormData((prev) => ({ ...prev, number_of_guests: Math.min(50, prev.number_of_guests + 1) }));
                                        if (errors.number_of_guests) setErrors((prev) => ({ ...prev, number_of_guests: undefined }));
                                    }}
                                    type="button"
                                >
                                    <Plus className="h-4 w-4" />
                                </button>
                            </div>
                            {errors.number_of_guests && <p className="mt-1 text-xs text-red-500">{errors.number_of_guests}</p>}
                        </div>

                        <div>
                            <Label className="text-gray-700" htmlFor="message">Message</Label>
                            <Textarea
                                aria-invalid={!!errors.message}
                                className="mt-1 min-h-20"
                                id="message"
                                name="message"
                                onChange={handleInputChange}
                                placeholder="Any special requirements or questions..."
                                value={formData.message}
                            />
                            {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message}</p>}
                        </div>

                        <Button
                            className="w-full"
                            disabled={status === "submitting"}
                            type="submit"
                        >
                            {status === "submitting" ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                "Book Now"
                            )}
                        </Button>

                        <p className="text-center text-sm text-gray-500">
                            Reserve now &amp; pay later
                        </p>
                    </form>
                )}
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

function formatEventDate(startDate: string, endDate?: null | string) {
    const start = new Date(startDate + "T00:00:00");
    const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" };
    if (endDate && endDate !== startDate) {
        const end = new Date(endDate + "T00:00:00");
        return `${start.toLocaleDateString("en-US", opts)} - ${end.toLocaleDateString("en-US", opts)}`;
    }
    return start.toLocaleDateString("en-US", opts);
}
