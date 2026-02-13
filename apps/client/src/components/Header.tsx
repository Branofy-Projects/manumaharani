"use client";
import { Bars3Icon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import { HeaderWrapper } from "./HeaderWrapper";

export const Header = () => {
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <HeaderWrapper>
      {/* Left: menu trigger */}
      <div className="flex flex-1 items-center gap-6">
        <label
          className="flex items-center gap-2 cursor-pointer text-[#2b2b2b]"
          htmlFor="mobile-menu-toggle"
        >
          <Bars3Icon className="w-6 h-6" />
          <span className="hidden sm:inline text-sm">Menu</span>
        </label>
      </div>

      {/* Center: brand wordmark */}
      <div className="flex flex-1 items-center justify-center">
        <Link
          className={`transition-all duration-300 ${isScrolled ? "h-7 sm:h-8" : "h-10 sm:h-14"} aspect-1820/1268 relative`}
          href="/"
        >
          <Image alt="Manu Maharani" fill sizes="200px" src="/Logo-Manu-Maharani.png" />
        </Link>
      </div>

      {/* Right: reserve */}
      <div className="flex flex-1 items-center justify-end gap-6">
        {/* <a
          className="bg-[#2b2b2b] text-[#f4efe8] px-5 py-2 text-sm tracking-wide"
          href="#reserve"
        >
          Reserve
        </a> */}
      </div>
    </HeaderWrapper>
  );
};
