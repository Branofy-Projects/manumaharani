import Image from "next/image";
import React from "react";

const experiences = [
  {
    img: "https://www.manumaharaniresorts.com/wp-content/uploads/2024/04/friends-and-family-4.webp",
    title: "Family & Friends",
  },
  {
    img: "https://www.manumaharaniresorts.com/wp-content/uploads/2024/04/outdoor-trails-4-1.webp",
    title: "Wilderness Traveller",
  },
  {
    img: "https://www.manumaharaniresorts.com/wp-content/uploads/2024/04/outdoor-trails-1-1.webp",
    title: "Social or Corporate",
  },
  {
    img: "https://www.manumaharaniresorts.com/wp-content/uploads/2024/04/romantic-getaway-2.webp",
    title: "Couple Traveller",
  },
];

export const HomeExperiencesSection = () => {
  return (
    <section
      className="relative flex h-full w-full flex-col items-center justify-center py-12 sm:py-16 md:py-20"
      id="experiences"
      style={{
        backgroundAttachment: "fixed",
        backgroundImage:
          "url(https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80)",
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <div className="pointer-events-none absolute inset-0 z-0 bg-black/70" />
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center font-thin leading-tight tracking-wide text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
          Experience Manu
          <br />
          Maharani As
        </h2>

        <div className="mt-10 grid grid-cols-2 gap-6 place-items-center sm:mt-12 sm:gap-8 md:mt-20 md:gap-10 lg:grid-cols-4 lg:gap-12">
          {experiences.map((item, idx) => (
            <div className="flex flex-col items-center text-center" key={idx}>
              <div className="relative h-32 w-32 overflow-hidden rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.35)] ring-4 ring-[#bde058] sm:h-40 sm:w-40 md:h-48 md:w-48 lg:h-56 lg:w-56">
                <Image
                  alt={item.title}
                  className="object-cover object-center"
                  fill
                  src={item.img}
                />
              </div>
              <p className="mt-4 font-light leading-tight text-white text-sm sm:text-base md:text-lg lg:text-xl">
                {item.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
