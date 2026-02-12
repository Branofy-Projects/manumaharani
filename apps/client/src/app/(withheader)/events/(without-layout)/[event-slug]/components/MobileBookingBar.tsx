"use client";

import { createEventBooking } from "@repo/actions/event-bookings.actions";
import {
    CheckCircle,
    Loader2,
    Minus,
    Plus,
    Star,
    X,
    XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
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

type FormErrors = Partial<Record<keyof z.infer<typeof bookingFormSchema>, string>>;

interface MobileBookingBarProps {
    discountedPrice?: null | string;
    discountPercentage?: number;
    eventId: string;
    originalPrice?: null | string;
    pricePer: string;
    rating?: null | string;
    reviewCount?: null | number;
}

export function MobileBookingBar({
    discountedPrice,
    discountPercentage = 0,
    eventId,
    originalPrice,
    pricePer,
    rating,
    reviewCount,
}: MobileBookingBarProps) {
    const [sheetOpen, setSheetOpen] = useState(false);

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

    useEffect(() => {
        if (sheetOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [sheetOpen]);

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
        <>
            {/* Sticky Bottom Bar - Mobile Only */}
            <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white px-4 py-3 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] lg:hidden">
                <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">
                        {displayPrice && (
                            <div className="flex items-baseline gap-2">
                                <span className="text-lg font-bold text-gray-900">
                                    ₹{Number(displayPrice).toLocaleString()}
                                </span>
                                {hasDiscount && originalPrice && (
                                    <span className="text-sm text-gray-400 line-through">
                                        ₹{Number(originalPrice).toLocaleString()}
                                    </span>
                                )}
                                <span className="text-xs text-gray-500">/ {pricePer}</span>
                            </div>
                        )}
                        {rating && (
                            <div className="mt-0.5 flex items-center gap-1">
                                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                                <span className="text-xs font-medium text-gray-700">{rating}</span>
                                {reviewCount && reviewCount > 0 && (
                                    <span className="text-xs text-gray-500">
                                        ({reviewCount.toLocaleString()})
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                    <Button
                        className="shrink-0 rounded-lg bg-blue-600 px-6 py-5 text-sm font-semibold text-white hover:bg-blue-700"
                        onClick={() => setSheetOpen(true)}
                    >
                        Book Now
                    </Button>
                </div>
            </div>

            {/* Slide-up Sheet */}
            {sheetOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div
                        className="absolute inset-0 bg-black/50 transition-opacity"
                        onClick={() => setSheetOpen(false)}
                    />

                    <div className="absolute inset-x-0 bottom-0 max-h-[90vh] overflow-y-auto rounded-t-2xl bg-white shadow-2xl animate-in slide-in-from-bottom duration-300">
                        <div className="sticky top-0 z-10 border-b border-gray-100 bg-white px-4 pb-3 pt-3 rounded-t-2xl">
                            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-gray-300" />
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Book This Event</h3>
                                    {displayPrice && (
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-sm text-gray-500">From</span>
                                            <span className="font-bold text-gray-900">
                                                ₹{Number(displayPrice).toLocaleString()}
                                            </span>
                                            {hasDiscount && originalPrice && (
                                                <span className="text-sm text-gray-400 line-through">
                                                    ₹{Number(originalPrice).toLocaleString()}
                                                </span>
                                            )}
                                            <span className="text-sm text-gray-500">per {pricePer}</span>
                                        </div>
                                    )}
                                </div>
                                <button
                                    className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
                                    onClick={() => setSheetOpen(false)}
                                    type="button"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        <div className="px-4 pb-8 pt-4">
                            {status === "success" && (
                                <div className="py-8 text-center">
                                    <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                                    <h3 className="mt-3 text-lg font-semibold text-gray-900">Booking Request Sent!</h3>
                                    <p className="mt-1 text-sm text-gray-600">
                                        We&apos;ll get back to you shortly with confirmation details.
                                    </p>
                                    <div className="mt-4 flex gap-3">
                                        <Button
                                            className="flex-1 rounded-lg"
                                            onClick={() => {
                                                resetForm();
                                                setSheetOpen(false);
                                            }}
                                            variant="outline"
                                        >
                                            Close
                                        </Button>
                                        <Button
                                            className="flex-1 rounded-lg"
                                            onClick={resetForm}
                                            variant="outline"
                                        >
                                            Submit another
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {status === "error" && (
                                <div className="py-8 text-center">
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

                            {(status === "idle" || status === "submitting") && (
                                <form className="space-y-4" onSubmit={handleSubmit}>
                                    <div>
                                        <Label className="text-gray-700" htmlFor="mobile-name">Full Name</Label>
                                        <Input
                                            aria-invalid={!!errors.name}
                                            className="mt-1 bg-white placeholder:text-gray-400"
                                            id="mobile-name"
                                            name="name"
                                            onChange={handleInputChange}
                                            placeholder="Your full name"
                                            value={formData.name}
                                        />
                                        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                                    </div>

                                    <div>
                                        <Label className="text-gray-700" htmlFor="mobile-email">Email</Label>
                                        <Input
                                            aria-invalid={!!errors.email}
                                            className="mt-1 bg-white placeholder:text-gray-400"
                                            id="mobile-email"
                                            name="email"
                                            onChange={handleInputChange}
                                            placeholder="your@email.com"
                                            type="email"
                                            value={formData.email}
                                        />
                                        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                                    </div>

                                    <div>
                                        <Label className="text-gray-700" htmlFor="mobile-phone">Phone</Label>
                                        <Input
                                            aria-invalid={!!errors.phone}
                                            className="mt-1 bg-white placeholder:text-gray-400"
                                            id="mobile-phone"
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
                                        <Label className="text-gray-700" htmlFor="mobile-message">Message</Label>
                                        <Textarea
                                            aria-invalid={!!errors.message}
                                            className="mt-1 min-h-20"
                                            id="mobile-message"
                                            name="message"
                                            onChange={handleInputChange}
                                            placeholder="Any special requirements or questions..."
                                            value={formData.message}
                                        />
                                        {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message}</p>}
                                    </div>

                                    <Button
                                        className="w-full rounded-lg bg-blue-600 py-6 text-lg font-semibold text-white hover:bg-blue-700"
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
                    </div>
                </div>
            )}
        </>
    );
}
