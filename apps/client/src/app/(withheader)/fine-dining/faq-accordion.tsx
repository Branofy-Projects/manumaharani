"use client";

import { useState } from "react";

const faqs = [
  {
    category: "General & Reservations",
    items: [
      {
        answer: "You can make a reservation directly through our website by clicking 'Reserve Now', calling our front desk, or emailing us. For chef-curated special dining experiences like the Gourmet Grill Private Dinner or Sunset Spark at Vyom, we recommend booking at least 48 hours in advance.",
        question: "How do I make a reservation at Manu Maharani Resorts & Spa?",
      },
      {
        answer: "Standard check-in time is 2:00 PM and check-out is 11:00 AM. Early check-in and late check-out can be arranged subject to availability. Our all-day dining restaurant Nivalaya serves breakfast from 7:00 AM, so you can enjoy a chef-curated meal even before your room is ready.",
        question: "What is the check-in and check-out time?",
      },
      {
        answer: "Yes, Manu Maharani Resorts & Spa is a pet-friendly property in Jim Corbett. We welcome well-behaved pets in designated areas. Please inform us at the time of booking so we can make the necessary arrangements.",
        question: "Is Manu Maharani Resorts & Spa a pet-friendly property?",
      },
      {
        answer: "Cancellations made 72 hours or more before check-in are fully refunded. Cancellations within 48–72 hours incur a 50% charge. Cancellations within 48 hours or no-shows are non-refundable. Artisanal experience bookings follow a separate policy — please contact us for details.",
        question: "What is the cancellation policy?",
      },
    ],
  },
  {
    category: "Dining & Experiences",
    items: [
      {
        answer: "Our restaurants offer chef-curated menus across a range of cuisines — Nivalaya serves artisanal multi-cuisine all-day dining, Vyom is our open-air rooftop bar by the Kosi River, and Rasa celebrates regional Kumaoni flavours with a discotheque by night.",
        question: "What type of cuisine does Manu Maharani serve?",
      },
      {
        answer: "Yes, our chef-curated menus cater to vegetarian, vegan, Jain, and gluten-free requirements. Please inform our team at the time of booking and we will personalise your fine dining experience accordingly.",
        question: "Do you accommodate dietary restrictions or allergies?",
      },
    ],
  },
];

export function FaqAccordion() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-10">
      {faqs.map((group) => (
        <div key={group.category}>
          <h3 className="font-serif text-xs tracking-[0.25em] uppercase text-[#c9a961] mb-5">
            {group.category}
          </h3>
          <div className="flex flex-col divide-y divide-[#e8e4dc] border-y border-[#e8e4dc]">
            {group.items.map((item, idx) => {
              const id = `${group.category}-${idx}`;
              const isOpen = open === id;
              return (
                <div key={id}>
                  <button
                    aria-expanded={isOpen}
                    className="w-full flex items-center justify-between gap-4 py-5 text-left group"
                    onClick={() => setOpen(isOpen ? null : id)}
                  >
                    <span className="font-serif text-sm md:text-base text-[#2b2b2b] group-hover:text-[#c9a961] transition-colors pr-4">
                      {idx + 1}. {item.question}
                    </span>
                    <span className={`flex-shrink-0 w-5 h-5 rounded-full border border-[#e8e4dc] flex items-center justify-center text-[#c9a961] transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}>
                      <svg fill="none" height="10" stroke="currentColor" strokeWidth="2" viewBox="0 0 10 10" width="10">
                        <path d="M5 1v8M1 5h8" />
                      </svg>
                    </span>
                  </button>
                  <div
                    className="overflow-hidden transition-all duration-300 ease-in-out"
                    style={{ maxHeight: isOpen ? "300px" : "0px", opacity: isOpen ? 1 : 0 }}
                  >
                    <p className="font-serif text-sm leading-relaxed text-[#5a5a5a] pb-5 pr-8">
                      {item.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
