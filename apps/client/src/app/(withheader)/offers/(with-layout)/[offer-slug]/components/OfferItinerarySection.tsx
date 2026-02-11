"use client";

import { Check, ChevronDown, Clock, MapPin } from "lucide-react";
import { useState } from "react";

import type { TOfferItinerary } from "@repo/db/schema/types.schema";

interface OfferItinerarySectionProps {
    itinerary: TOfferItinerary[];
}

export function OfferItinerarySection({ itinerary }: OfferItinerarySectionProps) {
    const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set([0]));

    const toggleItem = (index: number) => {
        setExpandedItems((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(index)) {
                newSet.delete(index);
            } else {
                newSet.add(index);
            }
            return newSet;
        });
    };

    const expandAll = () => {
        setExpandedItems(new Set(itinerary.map((_, i) => i)));
    };

    const collapseAll = () => {
        setExpandedItems(new Set());
    };

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl lg:text-2xl font-thin uppercase text-[#2b2b2b]">What to expect</h2>
                <div className="flex gap-3 text-sm">
                    <button
                        className="text-blue-600 hover:text-blue-700 hover:underline"
                        onClick={expandAll}
                        type="button"
                    >
                        Expand all
                    </button>
                    <span className="text-gray-300">|</span>
                    <button
                        className="text-blue-600 hover:text-blue-700 hover:underline"
                        onClick={collapseAll}
                        type="button"
                    >
                        Collapse all
                    </button>
                </div>
            </div>

            <div className="relative">
                {/* Vertical Timeline Line */}
                <div className="absolute left-[11px] top-6 bottom-6 w-0.5 bg-gray-200" />

                <div className="space-y-0">
                    {itinerary.map((item, index) => {
                        const isExpanded = expandedItems.has(index);
                        const isStop = item.is_stop !== false;

                        return (
                            <div className="relative" key={item.id}>
                                {/* Timeline Dot */}
                                <div
                                    className={`absolute left-0 top-6 z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 ${isStop
                                        ? "border-blue-600 bg-blue-600"
                                        : "border-gray-300 bg-white"
                                        }`}
                                >
                                    {isStop && (
                                        <span className="text-xs font-bold text-white">{index + 1}</span>
                                    )}
                                </div>

                                {/* Content Card */}
                                <div className="ml-10 pb-4">
                                    <button
                                        className="w-full rounded-lg border border-gray-200 bg-white p-4 text-left transition-shadow hover:shadow-md"
                                        onClick={() => toggleItem(index)}
                                        type="button"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1 pr-4">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-semibold text-gray-900">
                                                        {item.title}
                                                    </h3>
                                                    {!isStop && (
                                                        <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                                                            Pass by
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Meta info row */}
                                                <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-gray-500">
                                                    {item.duration && (
                                                        <div className="flex items-center gap-1">
                                                            <Clock className="h-3.5 w-3.5" />
                                                            <span>{item.duration}</span>
                                                        </div>
                                                    )}
                                                    {item.location && (
                                                        <div className="flex items-center gap-1">
                                                            <MapPin className="h-3.5 w-3.5" />
                                                            <span>{item.location}</span>
                                                        </div>
                                                    )}
                                                    {item.admission_included && (
                                                        <div className="flex items-center gap-1 text-green-600">
                                                            <Check className="h-3.5 w-3.5" />
                                                            <span>Admission included</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <ChevronDown
                                                className={`h-5 w-5 flex-shrink-0 text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""
                                                    }`}
                                            />
                                        </div>

                                        {/* Expanded Content */}
                                        {isExpanded && item.description && (
                                            <div className="mt-3 border-t pt-3">
                                                <p className="text-sm text-gray-600 leading-relaxed">
                                                    {item.description}
                                                </p>
                                            </div>
                                        )}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div >
    );
}
