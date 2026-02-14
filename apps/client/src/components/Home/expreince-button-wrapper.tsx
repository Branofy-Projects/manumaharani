"use client";
import React, { createContext, Suspense } from "react";

import { cn } from "@/lib/utils";

export const ExperienceContext = createContext<{
  isChooserOpen: boolean
  setIsChooserOpen: (data: boolean) => void
}>({
  isChooserOpen: false,
  setIsChooserOpen: () => { }
})

export default function ExperienceButtonWrapper({ children }: { children: React.ReactNode }) {
  const [isChooserOpen, setIsChooserOpen] = React.useState(false);

  // Disable body scroll when panel is open
  React.useEffect(() => {
    if (isChooserOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isChooserOpen]);

  return (
    <ExperienceContext.Provider value={{ isChooserOpen, setIsChooserOpen }}>
      <button
        className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2 rounded-full bg-black/80 px-6 py-3 text-base tracking-wide text-white shadow-lg transition-colors hover:bg-black sm:bottom-8 sm:px-8 sm:py-3.5"
        onClick={() => setIsChooserOpen(true)}
        type="button"
      >
        Choose Your Experience
      </button>

      {/* Fullscreen overlay and panel */}
      <div
        className={cn(
          "fixed inset-0 z-50 transition-opacity duration-300 ease-out",
          isChooserOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        )}
      >
        {/* Background overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-background/95 to-background/80 backdrop-blur-sm"
          onClick={() => setIsChooserOpen(false)}
        />

        {/* Panel content */}
        <aside
          className={cn(
            "absolute inset-0 flex h-full items-center overflow-y-auto text-foreground transition-transform duration-300 ease-out",
            isChooserOpen ? "translate-y-0" : "translate-y-full"
          )}
        >
          <div className="h-full w-full">
            {children}
          </div>
          <button
            aria-label="Close"
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-2xl text-white transition-colors hover:bg-white/40 sm:right-6 sm:top-6"
            onClick={() => setIsChooserOpen(false)}
            type="button"
          >
            ×
          </button>
        </aside>
      </div>
    </ExperienceContext.Provider>
  );
}
