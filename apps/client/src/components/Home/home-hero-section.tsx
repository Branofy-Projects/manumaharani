import { HomeHeroBookingBar } from "./HomeHeroBookingBar";

export const HomeHeroSection = () => {
  return (
    <section
      className="relative flex-1 flex items-end min-h-screen pt-[100px] md:pt-[140px] pb-0"
      id="hero"
    >
      {/* Video Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          autoPlay
          className="w-full h-full object-cover object-center"
          loop
          muted
          playsInline
          poster="https://www.fourseasons.com/alt/img-opt/~70.1530.0,0000-0,0000-1536,0000-864,0000/publish/content/dam/fourseasons/images/web/BSA/BSA_1200x800.jpg"
        >
          <source src="https://ik.imagekit.io/teggaadfo/manu%20-%201080WebShareName.mov/ik-video.mp4?updatedAt=1760112353814" />
        </video>
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
              <span className="text-2xl md:text-4xl font-thin tracking-[0.2em] md:tracking-[0.3em] uppercase text-white leading-tight pt-2 pb-4 md:pb-6">
                Luxury Riverside Resort in
                <br />
                Jim Corbett
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
              </div> */}
            </div>
          </div>
        </div>
      </div>

      {/* Booking Form in 5-part grid below divider */}
      <HomeHeroBookingBar />
    </section>
  );
};
