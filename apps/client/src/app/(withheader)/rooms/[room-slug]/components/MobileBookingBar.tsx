import { ExternalLink } from "lucide-react";

interface MobileBookingBarProps {
    basePrice: string;
    bookingUrl: string;
}

export function MobileBookingBar({
    basePrice,
    bookingUrl,
}: MobileBookingBarProps) {
    const hasBasePrice = basePrice && Number(basePrice) > 0;

    return (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white px-4 py-3 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] lg:hidden">
            <div className="flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                    {hasBasePrice && (
                        <div className="flex items-baseline gap-2">
                            <span className="text-lg font-bold text-gray-900">
                                ₹{Number(basePrice).toLocaleString("en-IN")}
                            </span>
                            <span className="text-xs text-gray-500">/ night</span>
                        </div>
                    )}
                </div>
                <a
                    className="flex shrink-0 items-center gap-2 rounded-lg bg-[#b68833] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#a07628]"
                    href={bookingUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                >
                    Book Now
                    <ExternalLink className="h-3.5 w-3.5" />
                </a>
            </div>
        </div>
    );
}
