import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";

// import { ChevronDownIcon } from '@heroicons/react/24/outline';

const columns = [
  {
    heading: "About",
    links: [
      {
        href: "/about-us",
        label: "About Us",
      },
      {
        href: "/contact-us",
        label: "Contact Us",
      },
    ],
  },
  {
    heading: "Explore",
    links: [
      {
        href: "/rooms",
        label: "Rooms",
      },
      {
        href: "/offers",
        label: "Experiences",
      },
      {
        href: "/events",
        label: "Events",
      },
      {
        href: "/fine-dining",
        label: "Fine Dining",
      },
      {
        href: "/junglesafari",
        label: "Jungle Safari",
      },
      {
        href: "/wedding",
        label: "Weddings",
      },
    ],
  },
  {
    heading: "News",
    links: [
      {
        href: "/blogs",
        label: "Blogs",
      },
    ],
  },
];

const legalLinks = [
  { href: "/legal-notice", label: "Legal Notice" },
  { href: "/privacy-notice", label: "Privacy Notice" },
  { href: "/cookie-preferences", label: "Cookie Preferences" },
  { href: "/do-not-sell", label: "Do Not Sell My Personal Information" },
  { href: "/accessibility-policy", label: "Accessibility Policy" },
  { href: "/modern-slavery-statement", label: "Modern Slavery Statement" },
];

export default function Footer() {
  return (
    <footer className="bg-background text-foreground pt-10 pb-10 px-2 md:pt-20 md:pb-20 md:px-4">
      <div className="flex flex-col items-center mb-8 md:mb-16">
        <div className="mb-4 md:mb-6 flex flex-col items-center">
          <Image
            alt="Manu Maharani Resort & Spa Logo"
            className="h-10 w-auto object-contain mb-2 md:h-16"
            height={64}
            src="/Logo-Manu-Maharani.png"
            width={200}
          />
        </div>
      </div>
      <div className="w-full max-w-screen-xl mx-auto grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-12 text-center md:text-left">
        {columns.map((col) => (
          <div key={col.heading}>
            <h3
              className="italic font-serif text-lg mb-6"
              style={{ color: "#b68833" }}
            >
              {col.heading}
            </h3>
            <ul className="space-y-3">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    className="uppercase text-xs tracking-widest font-semibold hover:text-foreground/70 transition"
                    href={link.href}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {/* Bottom Section */}
      <div className="w-full max-w-screen-xl mx-auto mt-8 md:mt-16">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 mb-4">
          {/* Social Icons */}
          <div className="flex gap-4 md:gap-6 items-center justify-center md:justify-start">
            <a
              aria-label="Facebook"
              className="hover:text-foreground/70 transition"
              href="#"
            >
              <FaFacebookF size={22} />
            </a>
            <a
              aria-label="Instagram"
              className="hover:text-foreground/70 transition"
              href="#"
            >
              <FaInstagram size={22} />
            </a>
            <a
              aria-label="YouTube"
              className="hover:text-foreground/70 transition"
              href="#"
            >
              <FaYoutube size={22} />
            </a>
          </div>
          {/* Language Selector */}
          {/* <div className="flex items-center gap-1 text-xs tracking-widest font-semibold cursor-pointer select-none mt-2 md:mt-0">
            ENGLISH
            <ChevronDownIcon className="w-4 h-4" />
          </div> */}
        </div>
        <hr className="border-t border-foreground/40 mb-4" />
        <div className="flex flex-col items-center md:items-start gap-2 text-xs text-foreground/70">
          {/* Legal Links */}
          <div className="flex flex-wrap gap-x-2 gap-y-2 justify-center md:justify-start">
            {legalLinks.map((link, idx) => (
              <React.Fragment key={link.label}>
                <Link
                  className="hover:text-foreground/70 text-foreground text-[0.6rem] transition whitespace-nowrap font-medium"
                  href={link.href}
                >
                  {link.label}
                </Link>
                {idx < legalLinks.length - 1 && (
                  <span className="mx-1 text-[0.6rem]">&bull;</span>
                )}
              </React.Fragment>
            ))}
          </div>
          {/* Copyright */}
          <div className="text-center md:text-right w-full md:w-auto">
            All Rights Reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
