import { Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import React from "react";

import ContactForm from "./ContactForm";
import { LazyMap } from "./LazyMap";

import type { Metadata } from "next";


export const metadata: Metadata = {
  description: "We'd love to hear from you! Reach out to us for any inquiries or assistance.",
  title: "Contact Us",
};

export default function ContactUsPage() {
  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[#faf6f1] pt-[72px] md:pt-[88px]">
      {/* Hero Section */}
      <section className="relative h-[50vh] w-full md:h-[60vh]">
        <Image
          alt="Contact Manu Maharani Resort"
          className="object-cover"
          fill
          priority
          sizes="100vw"
          src="/about-us/photo-1566073771259-6a8506099945.webp"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
          <h1 className="text-4xl  uppercase tracking-[0.2em] md:text-6xl">
            Contact Us
          </h1>
          <div className="mt-4 h-px w-24 bg-white/80" />
          <p className="mt-4 max-w-2xl px-4 font-serif text-lg italic text-white/90 md:text-xl">
            We&apos;d love to hear from you! Reach out to us for any inquiries or assistance.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Left: Contact Info */}
          <div className="flex flex-col justify-center">
            <h2 className="mb-6 font-serif text-3xl font-light uppercase tracking-widest text-[#2b2b2b] md:text-4xl">
              Get in <span className="text-[#a88b4d]">Touch</span>
            </h2>
            <div className="mb-8 h-px w-16 bg-[#a88b4d]" />

            <p className="mb-10 text-base leading-relaxed text-gray-600 md:text-lg">
              Have questions about your stay? Want to plan a special event? Our team is here to help you create unforgettable memories at Manu Maharani.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#a88b4d]/10 text-[#a88b4d]">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="mb-1 font-serif text-lg font-medium text-[#2b2b2b]">Address</h3>
                  <p className="text-gray-600">
                    Manu Maharani Resort & Spa,<br />
                    Dhikuli, Ramnagar,<br />
                    Jim Corbett National Park,<br />
                    Uttarakhand - 244715
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#a88b4d]/10 text-[#a88b4d]">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="mb-1 font-serif text-lg font-medium text-[#2b2b2b]">Phone</h3>
                  <p className="text-gray-600">
                    <a className="hover:text-[#a88b4d] transition-colors" href="tel:+919876543210">+91 98765 43210</a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#a88b4d]/10 text-[#a88b4d]">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="mb-1 font-serif text-lg font-medium text-[#2b2b2b]">Email</h3>
                  <p className="text-gray-600">
                    <a className="hover:text-[#a88b4d] transition-colors" href="mailto:info@manumaharani.com">info@manumaharani.com</a>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <ContactForm />
        </div>
      </section>

      {/* Map Section */}
      <LazyMap />
    </main>
  );
}
