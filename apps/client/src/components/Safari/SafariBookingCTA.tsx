import Image from "next/image";

export default function SafariBookingCTA() {
  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      <div className="absolute inset-0">
        <Image
          alt="Book Your Safari"
          className="object-cover"
          fill
          sizes="100vw"
          src="https://images.unsplash.com/photo-1549366021-9f761d450615?q=80&w=2000&auto=format&fit=crop"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>
      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center text-white">
        <h2 className="mb-6 text-2xl  tracking-[0.08em] uppercase md:text-4xl">
          Ready for Your Adventure?
        </h2>
        <p className="mb-8 text-base leading-relaxed md:text-lg">
          Let our concierge team help you plan the perfect safari experience.
          We&apos;ll handle all bookings, permits, and arrangements for a
          seamless wilderness adventure.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button className="rounded-lg bg-white px-8 py-4 text-sm font-semibold uppercase tracking-wide text-gray-900 transition-all hover:bg-gray-100">
            Book Safari Now
          </button>
          <button className="rounded-lg border-2 border-white bg-transparent px-8 py-4 text-sm font-semibold uppercase tracking-wide text-white transition-all hover:bg-white hover:text-gray-900">
            Contact Concierge
          </button>
        </div>
      </div>
    </section>
  );
}

