"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

import type { TGallery } from "@repo/db";

type GalleryGridProps = {
  gallery: TGallery[];
};

export function GalleryGrid({ gallery }: GalleryGridProps) {
  const [lightboxIndex, setLightboxIndex] = useState<null | number>(null);

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
    document.body.style.overflow = "hidden";
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
    document.body.style.overflow = "";
  }, []);

  const goToPrev = useCallback(() => {
    setLightboxIndex((prev) => {
      if (prev === null) return null;
      return prev === 0 ? gallery.length - 1 : prev - 1;
    });
  }, [gallery.length]);

  const goToNext = useCallback(() => {
    setLightboxIndex((prev) => {
      if (prev === null) return null;
      return prev === gallery.length - 1 ? 0 : prev + 1;
    });
  }, [gallery.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") goToPrev();
      if (e.key === "ArrowRight") goToNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, closeLightbox, goToPrev, goToNext]);

  const currentItem =
    lightboxIndex !== null ? gallery[lightboxIndex] : null;

  return (
    <>
      {/* Gallery Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {gallery.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-lg text-gray-500">
              No images found in this category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {gallery.map((item, index) => {
              const imageUrl =
                item.image?.large_url ||
                item.image?.original_url ||
                item.image?.medium_url;

              if (!imageUrl) return null;

              return (
                <div
                  className="group md:h-[300px] h-[250px] aspect-3/2 relative bg-background break-inside-avoid overflow-hidden rounded-lg cursor-pointer mb-4"
                  key={item.id}
                  onClick={() => openLightbox(index)}
                >
                  <Image
                    alt={item.image?.alt_text || item.title || "Gallery image"}
                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    src={imageUrl}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-end">
                    <div className="p-4 w-full translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      {item.title && (
                        <h3 className="text-white text-sm font-medium">
                          {item.title}
                        </h3>
                      )}
                      {item.description && (
                        <p className="text-white/80 text-xs mt-1 line-clamp-2">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )
        }
      </section>

      {/* Lightbox */}
      {lightboxIndex !== null && currentItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={closeLightbox}
        >
          <button
            className="absolute top-4 right-4 z-10 text-white/80 hover:text-white transition-colors p-2"
            onClick={closeLightbox}
          >
            <svg
              className="h-8 w-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M6 18L18 6M6 6l12 12"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
          </button>

          <button
            className="absolute left-4 z-10 text-white/80 hover:text-white transition-colors p-2"
            onClick={(e) => {
              e.stopPropagation();
              goToPrev();
            }}
          >
            <svg
              className="h-10 w-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M15 19l-7-7 7-7"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
          </button>

          <div
            className="relative max-h-[85vh] max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              alt={
                currentItem.image?.alt_text ||
                currentItem.title ||
                "Gallery image"
              }
              className="max-h-[85vh] w-auto h-auto object-contain rounded-lg"
              height={1000}
              sizes="90vw"
              src={
                currentItem.image?.original_url ||
                currentItem.image?.large_url ||
                ""
              }
              width={1400}
            />
            {(currentItem.title || currentItem.description) && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg">
                {currentItem.title && (
                  <h3 className="text-white text-lg font-medium">
                    {currentItem.title}
                  </h3>
                )}
                {currentItem.description && (
                  <p className="text-white/80 text-sm mt-1">
                    {currentItem.description}
                  </p>
                )}
              </div>
            )}
          </div>

          <button
            className="absolute right-4 z-10 text-white/80 hover:text-white transition-colors p-2"
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
          >
            <svg
              className="h-10 w-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M9 5l7 7-7 7"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
            {lightboxIndex + 1} / {gallery.length}
          </div>
        </div>
      )}
    </>
  );
}
