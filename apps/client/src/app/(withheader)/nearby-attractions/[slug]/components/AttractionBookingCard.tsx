"use client";

import { createAttractionBooking } from "@repo/actions";
import { format } from "date-fns";
import {
    CalendarIcon,
    CheckCircle,
    Clock,
    Loader2,
    MapPin,
    Minus,
    Plus,
    XCircle,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const bookingFormSchema = z.object({
    email: z.string().min(1, "Email is required").email("Please enter a valid email"),
    message: z.string().min(1, "Message is required").min(10, "Message must be at least 10 characters"),
    name: z.string().min(1, "Name is required").min(2, "Name must be at least 2 characters"),
    number_of_guests: z.number().min(1, "At least 1 guest is required").max(50, "Maximum 50 guests allowed"),
    phone: z.string().min(1, "Phone is required").min(10, "Phone must be at least 10 digits"),
    travel_date: z.date("Travel date is required"),
});

interface AttractionBookingCardProps {
    attractionId: string;
    closeTime?: null | string;
    distance?: null | string;
    openTime?: null | string;
}

type FormErrors = Partial<Record<keyof z.infer<typeof bookingFormSchema>, string>>;

export function AttractionBookingCard({
    attractionId,
    closeTime,
    distance,
    openTime,
}: AttractionBookingCardProps) {
    const [formData, setFormData] = useState({
        email: "",
        message: "",
        name: "",
        number_of_guests: 1,
        phone: "",
        travel_date: undefined as Date | undefined,
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
            await createAttractionBooking({
                ...result.data,
                attraction_id: attractionId,
                travel_date: format(result.data.travel_date, "yyyy-MM-dd"),
            });
            setStatus("success");
        } catch {
            setStatus("error");
        }
    };

    const resetForm = () => {
        setFormData({ email: "", message: "", name: "", number_of_guests: 1, phone: "", travel_date: undefined });
        setErrors({});
        setStatus("idle");
    };

    return (
        <div className="sticky top-28">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">Plan Your Visit</h3>

                {/* Quick Info */}
                <div className="mb-6 space-y-2">
                    {(openTime || closeTime) && (
                        <div className="flex items-center gap-3 text-sm">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span className="text-gray-700">
                                {[openTime, closeTime].filter(Boolean).join(" - ")}
                            </span>
                        </div>
                    )}
                    {distance && (
                        <div className="flex items-center gap-3 text-sm">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span className="text-gray-700">{distance}</span>
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
                            <Label className="text-gray-700">Travel Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        className={cn(
                                            "mt-1 w-full justify-start text-left font-normal bg-white",
                                            !formData.travel_date && "text-gray-400"
                                        )}
                                        variant="outline"
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {formData.travel_date ? format(formData.travel_date, "PPP") : "Pick a date"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent align="start" className="w-auto p-0">
                                    <Calendar
                                        disabled={(date) => date < new Date()}
                                        initialFocus
                                        mode="single"
                                        onSelect={(date) => {
                                            setFormData((prev) => ({ ...prev, travel_date: date }));
                                            if (errors.travel_date) setErrors((prev) => ({ ...prev, travel_date: undefined }));
                                        }}
                                        selected={formData.travel_date}
                                    />
                                </PopoverContent>
                            </Popover>
                            {errors.travel_date && <p className="mt-1 text-xs text-red-500">{errors.travel_date}</p>}
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
                            className="w-full rounded-lg bg-[#b68833] py-6 text-lg font-semibold text-white hover:bg-[#a07728]"
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
                    className="mt-1 inline-block text-sm font-semibold text-[#b68833] hover:text-[#a07728] hover:underline"
                    href="/contact-us"
                >
                    Contact us
                </Link>
            </div>
        </div>
    );
}
