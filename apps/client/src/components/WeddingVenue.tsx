'use client';
import Image from "next/image";
import { useState } from "react";


type Destination = {
    blurb: string;
    image: string;
    title: string;
}
export default function WeddingVenue({ destinations }: { destinations: Destination[] }) {
    const [index, setIndex] = useState(2);
    const count = destinations.length;
    // derived inside renderPanel
    const [outIndex, setOutIndex] = useState<null | number>(null);
    const [animDir, setAnimDir] = useState<"next" | "prev" | null>(null);
    const ANIM_MS = 450;

    const handlePrev = () => {
        if (animDir) return;
        setOutIndex(index);
        setAnimDir("prev");
        setIndex((i) => (i + count - 1) % count);
        setTimeout(() => {
            setOutIndex(null);
            setAnimDir(null);
        }, ANIM_MS);
    };

    const handleNext = () => {
        if (animDir) return;
        setOutIndex(index);
        setAnimDir("next");
        setIndex((i) => (i + 1) % count);
        setTimeout(() => {
            setOutIndex(null);
            setAnimDir(null);
        }, ANIM_MS);
    };
    return (
        <div className="w-full">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr_1fr] gap-y-0 gap-x-6 md:gap-x-10 items-stretch">
                {/* Left panel (Prev) */}
                <button
                    aria-label="Previous destination"
                    className="relative border border-[#b68833]/40 bg-gradient-to-b from-rose-50 to-white p-6 md:p-8 text-left hidden lg:flex flex-col justify-between transition-transform duration-200 active:scale-[0.98]"
                    onClick={handlePrev}
                    type="button"
                >
                    <div />
                    <div>
                        <span className="text-xs tracking-widest uppercase block text-[#2b2b2b]/70">
                            {destinations[(index + count - 1) % count]!.title}
                        </span>
                    </div>
                    <div className="flex items-center justify-start">
                        <span className="w-12 h-12 rounded-full border border-[#b68833] text-[#b68833] flex items-center justify-center text-xl transition-colors duration-200 hover:bg-[#b68833] hover:text-white">
                            ‹
                        </span>
                    </div>
                </button>

                {/* Center - animated image and details */}
                <div className="bg-white">
                    <div className="relative w-full overflow-hidden">
                        {outIndex !== null && animDir ? (
                            <>
                                <div
                                    className={`absolute inset-0 ${animDir === "next"
                                        ? "animate-wedding-out-left"
                                        : "animate-wedding-out-right"
                                        }`}
                                >
                                    <div className="relative w-full aspect-[16/9]">
                                        <Image
                                            alt={destinations[outIndex]!.title}
                                            className="object-cover"
                                            fill
                                            src={destinations[outIndex]!.image}
                                        />
                                    </div>
                                </div>
                                <div
                                    className={
                                        animDir === "next"
                                            ? "animate-wedding-in-right"
                                            : "animate-wedding-in-left"
                                    }
                                >
                                    <div className="relative w-full aspect-[16/9]">
                                        <Image
                                            alt={destinations[index]!.title}
                                            className="object-cover"
                                            fill
                                            src={destinations[index]!.image}
                                        />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="relative w-full aspect-[16/9]">
                                <Image
                                    alt={destinations[index]!.title}
                                    className="object-cover"
                                    fill
                                    src={destinations[index]!.image}
                                />
                            </div>
                        )}
                    </div>
                    <div className="p-6 md:p-8 text-center">
                        <h3 className="tracking-widest uppercase font-thin text-base md:text-lg">
                            {destinations[index]!.title}
                        </h3>
                        <p
                            className={`mt-3 md:mt-4 text-sm md:text-base font-serif text-[#2b2b2b]/80 max-w-3xl mx-auto ${animDir
                                ? animDir === "next"
                                    ? "animate-wedding-in-right"
                                    : "animate-wedding-in-left"
                                : ""
                                }`}
                        >
                            {destinations[index]!.blurb}
                        </p>
                    </div>
                </div>

                {/* Right panel (Next) */}
                <button
                    aria-label="Next destination"
                    className="relative border border-[#b68833]/40 bg-gradient-to-b from-rose-50 to-white p-6 md:p-8 text-right hidden lg:flex flex-col justify-between transition-transform duration-200 active:scale-[0.98]"
                    onClick={handleNext}
                    type="button"
                >
                    <div />
                    <div>
                        <span className="text-xs tracking-widest uppercase block text-[#2b2b2b]/70">
                            {destinations[(index + 1) % count]!.title}
                        </span>
                    </div>
                    <div className="flex items-center justify-end">
                        <span className="w-12 h-12 rounded-full border border-[#b68833] text-[#b68833] flex items-center justify-center text-xl transition-colors duration-200 hover:bg-[#b68833] hover:text-white">
                            ›
                        </span>
                    </div>
                </button>
            </div>
        </div>
    );
}