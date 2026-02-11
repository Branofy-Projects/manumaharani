"use client";

import { ChevronLeft, ChevronRight, Grid3X3, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

interface RoomGalleryProps {
    images: string[];
    title: string;
}

export function RoomGallery({ images, title }: RoomGalleryProps) {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const openLightbox = (index: number) => {
        setCurrentIndex(index);
        setLightboxOpen(true);
    };

    const closeLightbox = () => {
        setLightboxOpen(false);
    };

    const goToPrevious = useCallback(() => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    }, [images.length]);

    const goToNext = useCallback(() => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, [images.length]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!lightboxOpen) return;

            switch (e.key) {
                case "ArrowLeft":
                    goToPrevious();
                    break;
                case "ArrowRight":
                    goToNext();
                    break;
                case "Escape":
                    closeLightbox();
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [lightboxOpen, goToPrevious, goToNext]);

    useEffect(() => {
        if (lightboxOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [lightboxOpen]);

    if (images.length === 0) {
        return (
            <div className="bg-gray-50">
                <div className="mx-auto max-w-screen-xl px-4 py-6">
                    <div className="flex aspect-[16/9] w-full items-center justify-center rounded-2xl bg-gray-100">
                        <span className="text-sm text-gray-500">No images available</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="bg-gray-50">
                <div className="mx-auto max-w-screen-xl px-4 py-4">
                    {images.length === 1 ? (
                        <div
                            className="relative aspect-[16/9] max-h-[500px] w-full cursor-pointer overflow-hidden rounded-2xl"
                            onClick={() => openLightbox(0)}
                        >
                            <Image
                                alt={title}
                                className="object-cover transition-transform hover:scale-[1.02]"
                                fill
                                priority
                                src={images[0]}
                            />
                        </div>
                    ) : images.length === 2 ? (
                        <div className="grid grid-cols-2 gap-2">
                            {images.map((img, idx) => (
                                <div
                                    className={`relative aspect-[4/3] cursor-pointer overflow-hidden ${idx === 0 ? "rounded-l-2xl" : "rounded-r-2xl"}`}
                                    key={idx}
                                    onClick={() => openLightbox(idx)}
                                >
                                    <Image
                                        alt={`${title} - Image ${idx + 1}`}
                                        className="object-cover transition-transform hover:scale-[1.02]"
                                        fill
                                        priority={idx === 0}
                                        src={img}
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <>
                            {/* Mobile: Show only 1 image */}
                            <div className="relative aspect-[16/9] max-h-[400px] w-full cursor-pointer overflow-hidden rounded-2xl md:hidden" onClick={() => openLightbox(0)}>
                                <Image
                                    alt={title}
                                    className="object-cover transition-transform hover:scale-[1.02]"
                                    fill
                                    priority
                                    src={images[0]}
                                />
                                {images.length > 1 && (
                                    <div className="absolute bottom-3 right-3 flex items-center gap-2 rounded-lg bg-gray-900/80 px-3 py-2 text-white backdrop-blur-sm transition-colors hover:bg-gray-900/90">
                                        <Grid3X3 className="h-4 w-4" />
                                        <span className="text-sm font-medium text-white">
                                            See all {images.length} photos
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Tablet: Show 3 images */}
                            <div className="hidden h-[350px] grid-cols-3 grid-rows-2 gap-2 md:grid lg:hidden">
                                <div
                                    className="relative col-span-2 row-span-2 cursor-pointer overflow-hidden rounded-l-2xl"
                                    onClick={() => openLightbox(0)}
                                >
                                    <Image
                                        alt={title}
                                        className="object-cover transition-transform hover:scale-[1.02]"
                                        fill
                                        priority
                                        src={images[0]}
                                    />
                                </div>
                                <div
                                    className="relative cursor-pointer overflow-hidden rounded-tr-2xl"
                                    onClick={() => openLightbox(1)}
                                >
                                    <Image
                                        alt={`${title} - Image 2`}
                                        className="object-cover transition-transform hover:scale-[1.02]"
                                        fill
                                        src={images[1]}
                                    />
                                </div>
                                <div
                                    className="relative cursor-pointer overflow-hidden rounded-br-2xl"
                                    onClick={() => openLightbox(2)}
                                >
                                    <Image
                                        alt={`${title} - Image 3`}
                                        className="object-cover transition-transform hover:scale-[1.02]"
                                        fill
                                        src={images[2]}
                                    />
                                    {images.length > 3 && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/60 transition-colors hover:bg-gray-900/70">
                                            <div className="text-center text-white">
                                                <Grid3X3 className="mx-auto mb-1 h-6 w-6" />
                                                <span className="text-sm font-medium text-white">
                                                    See all {images.length} photos
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Desktop: 1 large + 4 small */}
                            <div className="hidden h-[400px] grid-cols-4 grid-rows-2 gap-2 lg:grid xl:h-[450px] 2xl:h-[500px]">
                                <div
                                    className="relative col-span-2 row-span-2 cursor-pointer overflow-hidden rounded-l-2xl"
                                    onClick={() => openLightbox(0)}
                                >
                                    <Image
                                        alt={title}
                                        className="object-cover transition-transform hover:scale-[1.02]"
                                        fill
                                        priority
                                        src={images[0]}
                                    />
                                </div>
                                {images.slice(1, 3).map((img, idx) => (
                                    <div
                                        className={`relative cursor-pointer overflow-hidden ${idx === 1 ? "rounded-tr-2xl" : ""}`}
                                        key={idx}
                                        onClick={() => openLightbox(idx + 1)}
                                    >
                                        <Image
                                            alt={`${title} - Image ${idx + 2}`}
                                            className="object-cover transition-transform hover:scale-[1.02]"
                                            fill
                                            src={img}
                                        />
                                    </div>
                                ))}
                                {images.slice(3, 5).map((img, idx) => (
                                    <div
                                        className={`relative cursor-pointer overflow-hidden ${idx === 1 ? "rounded-br-2xl" : ""}`}
                                        key={idx}
                                        onClick={() => openLightbox(idx + 3)}
                                    >
                                        <Image
                                            alt={`${title} - Image ${idx + 4}`}
                                            className="object-cover transition-transform hover:scale-[1.02]"
                                            fill
                                            src={img}
                                        />
                                        {idx === 1 && images.length > 5 && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-gray-900/60 transition-colors hover:bg-gray-900/70">
                                                <div className="text-center text-white">
                                                    <Grid3X3 className="mx-auto mb-1 h-6 w-6" />
                                                    <span className="text-sm font-medium text-white">
                                                        See all {images.length} photos
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Lightbox Modal */}
            {lightboxOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900">
                    <div className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between p-4">
                        <span className="text-sm font-medium text-white">
                            {currentIndex + 1} / {images.length}
                        </span>
                        <button
                            aria-label="Close gallery"
                            className="rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
                            onClick={closeLightbox}
                            type="button"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    <button
                        aria-label="Previous image"
                        className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
                        onClick={goToPrevious}
                        type="button"
                    >
                        <ChevronLeft className="h-8 w-8" />
                    </button>

                    <div className="relative h-[80vh] w-[90vw] max-w-6xl">
                        <Image
                            alt={`${title} - Image ${currentIndex + 1}`}
                            className="object-contain"
                            fill
                            priority
                            src={images[currentIndex]}
                        />
                    </div>

                    <button
                        aria-label="Next image"
                        className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
                        onClick={goToNext}
                        type="button"
                    >
                        <ChevronRight className="h-8 w-8" />
                    </button>

                    <div className="absolute bottom-4 left-1/2 z-20 flex max-w-[90vw] -translate-x-1/2 gap-2 overflow-x-auto px-4 py-2">
                        {images.map((img, idx) => (
                            <button
                                className={`relative h-14 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${idx === currentIndex
                                    ? "border-white ring-2 ring-white ring-offset-2 ring-offset-gray-900"
                                    : "border-transparent opacity-60 hover:opacity-80"
                                    }`}
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                type="button"
                            >
                                <Image
                                    alt={`Thumbnail ${idx + 1}`}
                                    className="object-cover"
                                    fill
                                    src={img}
                                />
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}
