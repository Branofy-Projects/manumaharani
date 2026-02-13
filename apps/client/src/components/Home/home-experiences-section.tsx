'use server'
import { getExperiences } from "@repo/actions/experiences.actions";
import { cacheTag } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const getCachedExperiences = async () => {
  "use cache";
  cacheTag("experiences");
  const { experiences } = await getExperiences();

  return experiences;
};

export const HomeExperiencesSection = async () => {

  const experiences = await getCachedExperiences();

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
        <h2 className="text-center  leading-tight tracking-wide text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
          Experience Manu
          <br />
          Maharani As
        </h2>

        <div className="mt-10 grid grid-cols-2 gap-6 place-items-center sm:mt-12 sm:gap-8 md:mt-20 md:gap-10 lg:grid-cols-4 lg:gap-12">
          {experiences.map((item, idx) => (
            <Link className="flex flex-col items-center text-center" href={item.url} key={idx}>
              <div className="relative h-32 w-32 overflow-hidden rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.35)] ring-4 ring-[#bde058] sm:h-40 sm:w-40 md:h-48 md:w-48 lg:h-56 lg:w-56">
                <Image
                  alt={item.alt}
                  className="object-cover object-center"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  src={item.image}
                />
              </div>
              <p className="mt-4 font-light leading-tight text-white text-sm sm:text-base md:text-lg lg:text-xl">
                {item.name}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
