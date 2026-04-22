"use client";

import { useEffect, useState } from "react";

const testimonials = [
  {
    author: "Ananya & Rahul",
    quote: "The candlelight dinner at Maharani Lawn was the highlight of our honeymoon. The ambience was unmatched.",
  },
  {
    author: "Priya S.",
    quote: "Vyom's sunset experience is unlike anything else in Jim Corbett — the artisanal mocktails, the river view, pure magic.",
  },
  {
    author: "Vikram & Family",
    quote: "Nivalaya's chef-curated breakfast spread was incredible. Fresh, varied, and the staff made us feel so welcome every morning.",
  },
  {
    author: "Meera J.",
    quote: "The Safari Picnic Hamper was a beautiful surprise. Artisanal food in the middle of the jungle — absolutely unforgettable.",
  },
];

export function TestimonialRotator() {
  const [current, setCurrent] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % testimonials.length);
        setFade(true);
      }, 300);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const t = testimonials[current];

  return (
    <div className="flex flex-col flex-1">
      <div className="transition-opacity duration-300 flex-1" style={{ opacity: fade ? 1 : 0 }}>
        <blockquote className="font-serif text-base md:text-lg italic leading-relaxed text-[#2b2b2b] mb-4">
          &ldquo;{t.quote}&rdquo;
        </blockquote>
        <p className="font-serif text-sm text-[#5a5a5a]">— {t.author}</p>
      </div>
      <div className="flex gap-2 mt-6">
        {testimonials.map((_, i) => (
          <button
            aria-label={`Testimonial ${i + 1}`}
            key={i}
            onClick={() => {
              setFade(false);
              setTimeout(() => { setCurrent(i); setFade(true); }, 300);
            }}
          >
            <span className={`block rounded-full transition-all duration-300 ${i === current ? "w-5 h-2 bg-[#c9a961]" : "w-2 h-2 bg-[#d0cbc2]"}`} />
          </button>
        ))}
      </div>
    </div>
  );
}
