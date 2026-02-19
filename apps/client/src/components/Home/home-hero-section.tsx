import Image from "next/image";

import { HeroVideo } from "./hero-video";

export const HomeHeroSection = () => {
  return (
    <section
      className="relative flex-1 flex items-end min-h-screen pt-[100px] md:pt-[140px] pb-0"
      id="hero"
    >
      {/* Video Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Priority poster image for fast LCP */}
        <Image
          alt="Manu Maharani Resort aerial view"
          className="object-cover object-center"
          fill
          priority
          sizes="100vw"
          src="https://storage.googleapis.com/manumaharani-files-bucket/static/1771513678071-Safari__Home_page_.webp"
        />
        <HeroVideo />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 w-full px-4 md:px-8 pb-40 md:pb-32">
        <div className="max-w-7xl mx-auto">
          <div className="w-full animate-fadeInUp gap-y-8">
            <h1 className="gap-y-4 flex flex-col">
              <span className="text-base md:text-lg font-serif p-0 italic text-white/90">
                Manu Maharani Resort & Spa
              </span>
              <span className="text-2xl md:text-4xl  tracking-[0.2em] md:tracking-[0.3em] uppercase text-white leading-tight pt-2 pb-4 md:pb-6">
                Luxury Riverside Resort
                <br />
                in Jim Corbett
              </span>
            </h1>
            <div>
              <div className="space-y-2 mb-2 text-base md:text-lg tracking-wider">
                <p className="text-white/90 text-xs md:text-sm">
                  Best Stay, Breathtaking Views, Infinity Swimming Pool, on-site choice of Restaurants & Roof Top Bar,
                  Vyom
                </p>
              </div>
              {/* <div className="flex gap-2 md:gap-4 flex-wrap">
                <button className="text-white text-xs font-bold h-5 tracking-widest hover:text-white/50 transition border-b-1 border-white">
                  +91 – 9971889911
                </button>
                {/* <button className="text-white text-xs font-bold h-5 tracking-widest hover:text-white/50 transition border-b-1 border-white">
                  Book Now
                </button> */}
            </div>
          </div>
        </div>
      </div>

      {/* Booking Form in 5-part grid below divider */}
      {/* <HomeHeroBookingBar /> */}
    </section >
  );
};
