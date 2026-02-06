"use client";
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

export interface FestivityItem {
  description: string;
  id: string;
  image: string;
  label: string;
}

interface WeddingFestivitiesProps {
  initialIndex?: number;
  items: FestivityItem[];
}

export default function WeddingFestivities({
  initialIndex = 0,
  items,
}: WeddingFestivitiesProps) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  // Removed unused refs
  // const tabsContainerRef = useRef<HTMLDivElement>(null);
  // const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const [isAnimating, setIsAnimating] = useState(false);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handleTabClick = (index: number) => {
    if (index === activeIndex || isAnimating) return;
    setIsAnimating(true);
    setActiveIndex(index);
    setTimeout(() => setIsAnimating(false), 500);
  };

  // Disable body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  // No scroll needed as we only show 5 items at a time
  useEffect(() => {
    // Future: Add transition animations here if needed
  }, [activeIndex]);

  const activeItem = items[activeIndex];

  // Calculate positions for all items relative to the active index
  const getVisibleItems = () => {
    const totalItems = items.length;

    return items.map((item, index) => {
      // Calculate distance from active index
      let offset = index - activeIndex;

      // Adjust for wrap-around
      if (offset > totalItems / 2) offset -= totalItems;
      if (offset < -totalItems / 2) offset += totalItems;

      return {
        ...item,
        isVisible: Math.abs(offset) <= 2, // Show centered item + 2 neighbors on each side
        offset,
        originalIndex: index,
      };
    });
  };

  const visibleItems = getVisibleItems();

  return (
    <section className="relative w-full overflow-hidden bg-[#faf6f1]">
      {/* Background floral pattern overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage: "url('/back.png')",
          // backgroundImage:
          //   "url('https://images.unsplash.com/photo-1490750967868-88aa4486c946?q=80&w=1600&auto=format&fit=crop')",
          backgroundPosition: "center top",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      />

      <div className="relative z-10 mx-auto py-12 md:py-20">
        {/* Title Section */}
        <div className="mb-10 max-w-[1400px] px-4 mx-auto text-center md:mb-14">
          <div className="mb-6 flex items-center justify-center gap-4">
            <div className="h-px w-12 bg-gray-500 md:w-16" />
            <h2 className=" text-2xl font-thin uppercase tracking-[0.2em] text-gray-800 md:text-4xl lg:text-5xl">
              Corbett Wedding Celebrations
            </h2>
            <div className="h-px w-12 bg-gray-500 md:w-16" />
          </div>
          <p className="mx-auto font-serif  max-w-3xl text-sm leading-relaxed text-gray-600 md:text-base">
            From riverside mehndi to starlit receptions, celebrate every ritual across our 5
            wedding venues. Corbett's natural beauty enhances intimate gatherings and grand
            festivities with Kumaoni traditions and modern elegance.
          </p>
        </div>

        {/* Mobile Dropdown Button */}
        <div className="mb-8 md:hidden relative z-20 px-4  ">
          <button
            className="w-full bg-[#a88b4d] text-white py-3 px-6 uppercase tracking-[0.15em] text-xs font-medium flex justify-between items-center"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <span>{activeItem?.label}</span>
            <span className="transform rotate-90">›</span>
          </button>
        </div>

        {/* Mobile Full Screen Menu */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-[100] bg-[#faf6f1] flex flex-col md:hidden pt-[72px] md:pt-[88px]">
            <div className="pb-8 pt-4">
              <div className="flex justify-between items-start ">
                <h3 className="text-[#a88b4d] px-8 text-2xl font-serif mb-8 tracking-wide uppercase">
                  Timeless
                  <br />
                  Weddings
                </h3>
                <div className="flex justify-end p-6 pt-0">
                  <button
                    className="text-xl font-light text-[#a88b4d]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    ✕
                  </button>
                </div>
              </div>
              <div className="flex flex-col space-y-0 overflow-y-auto max-h-[calc(100vh-100px)]">
                {items.map((item, index) => (
                  <button
                    className={`py-4 text-left px-8 uppercase tracking-[0.1em] text-sm border-b border-[#dcdcdc] ${index === activeIndex
                        ? "text-[#a88b4d] font-medium"
                        : "text-[#8c8c8c]"
                      }`}
                    key={item.id}
                    onClick={() => {
                      handleTabClick(index);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Navigation Tabs Carousel - Desktop Only */}
        <div className="relative max-w-[1400px] px-4 mx-auto mb-0 hidden md:block">
          {/* Left Arrow */}
          <button
            aria-label="Previous festivity"
            className="absolute -left-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#c9a961] bg-white text-xl text-[#c9a961] shadow-sm transition-all hover:bg-[#c9a961] hover:text-white md:-left-4 md:h-12 md:w-12"
            onClick={handlePrev}
            type="button"
          >
            ‹
          </button>

          {/* Tabs Container - Infinite Center */}
          <div className="mx-12 overflow-hidden md:mx-16">
            <div className="relative flex items-center justify-center h-18">
              {visibleItems.map((item) => {
                const isActive = item.originalIndex === activeIndex;

                // Strictly hide items that are out of the 5-item window
                // We allow a small buffer for animation but hide anything else
                if (Math.abs(item.offset) > 2.5) return null;

                return (
                  <div
                    className="absolute transition-all duration-500 h-full ease-in-out flex items-center justify-center"
                    key={item.id}
                    style={{
                      opacity: Math.abs(item.offset) > 1 ? 0.5 : 1,
                      pointerEvents:
                        Math.abs(item.offset) > 2 ? "none" : "auto",
                      transform: `translateX(${item.offset * 100}%)`,
                      // Ensure items strictly outside -2 to 2 range are hidden
                      visibility:
                        Math.abs(item.offset) > 2 ? "hidden" : "visible",
                      width: "20%", // 5 items = 20% each
                      zIndex: isActive ? 10 : 0,
                    }}
                  >
                    <div className="flex items-center w-full justify-center h-full bg-[#faf6f1]">
                      <button
                        className={`relative flex-shrink-0 h-full px-1 py-4 text-center transition-transform md:px-2 md:py-5 w-full overflow-hidden`}
                        onClick={() => handleTabClick(item.originalIndex)}
                        style={
                          isActive
                            ? {
                              background:
                                "linear-gradient(270deg, rgba(255, 212, 202, 0) 0.33%, rgb(255, 212, 202) 51.67%, rgba(255, 212, 202, 0) 100%)",
                              borderImage:
                                "linear-gradient(to right, rgba(69, 68, 63, 0), rgb(173, 139, 58), rgba(69, 68, 63, 0)) 1 0 / 1 / 0 stretch",
                              borderStyle: "solid",
                              borderWidth: "1px 0",
                            }
                            : {}
                        }
                        type="button"
                      >
                        <span
                          className={`block font-serif w-full whitespace-normal text-[10px] uppercase tracking-[0.1em] md:text-xs lg:text-sm leading-tight ${isActive
                              ? "font-medium text-gray-900"
                              : "font-normal text-gray-500"
                            }`}
                        >
                          {item.label}
                        </span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Arrow */}
          <button
            aria-label="Next festivity"
            className="absolute -right-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#c9a961] bg-white text-xl text-[#c9a961] shadow-sm transition-all hover:bg-[#c9a961] hover:text-white md:-right-4 md:h-12 md:w-12"
            onClick={handleNext}
            type="button"
          >
            ›
          </button>
        </div>

        {/* Single Active Content */}
        <div className="grid grid-cols-1 gap-0 mt-4 md:grid-cols-2">
          {/* Image - Left Side */}
          <div className="relative ">
            <div
              className="relative aspect-[16/9] w-full overflow-hidden"
              style={{
                maskImage:
                  "linear-gradient(to right, black 70%, transparent 100%)",
                WebkitMaskImage:
                  "linear-gradient(to right, black 70%, transparent 100%)",
              }}
            >
              <Image
                alt={activeItem?.label || ""}
                className={`object-cover transition-all duration-500 ease-in-out ${isAnimating
                    ? "scale-105 opacity-80 blur-sm"
                    : "scale-100 opacity-100 blur-0"
                  }`}
                fill
                key={activeItem?.id}
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                src={activeItem?.image || ""}
              />
            </div>
          </div>

          {/* Text Content - Right Side */}
          <div className="flex flex-col justify-center  px-8 py-10 md:px-12 md:py-16 lg:px-16">
            <div
              className={`transition-all duration-500 ease-in-out ${isAnimating
                  ? "translate-y-4 opacity-0"
                  : "translate-y-0 opacity-100"
                }`}
            >
              <div className="mb-6 flex items-center gap-4">
                <div className="h-px w-10 bg-gray-400" />
                <h3 className="font-thin text-2xl font-light uppercase tracking-[0.15em] text-gray-800 md:text-3xl lg:text-4xl">
                  {activeItem?.label || ""}
                </h3>
              </div>
              <p className="max-w-xl font-serif text-base leading-relaxed text-gray-600 md:text-lg">
                {activeItem?.description || ""}
              </p>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        {/* <div className="mt-12 flex justify-center md:mt-16">
          <button
            className="bg-[#2b2b2b] px-10 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-white transition-all hover:bg-[#1a1a1a] md:text-sm"
            type="button"
          >
            Plan Your Activities
          </button>
        </div> */}
      </div>
    </section>
  );
}
