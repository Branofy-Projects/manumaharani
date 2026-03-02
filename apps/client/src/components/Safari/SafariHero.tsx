import Image from "next/image";

export default function SafariHero() {
  return (
    <section className="relative flex h-[70vh] min-h-[500px] w-full items-center overflow-hidden sm:h-[80vh] lg:min-h-[600px]">
      <Image
        alt="Jim Corbett Jungle Safari"
        className="object-cover object-center"
        fill
        priority
        sizes="100vw"
        src="https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?q=80&w=2000&auto=format&fit=crop"
      />
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 text-center text-white sm:px-6 lg:px-8">
        <h1 className="mb-6 text-3xl  tracking-[0.15em] uppercase md:text-5xl lg:text-6xl">
          Jungle Safari
        </h1>
        <p className="mx-auto max-w-3xl text-base font-light leading-relaxed md:text-lg lg:text-xl">
          Embark on an unforgettable adventure through Jim Corbett National
          Park, India&apos;s oldest and most prestigious tiger reserve
        </p>
      </div>
    </section>
  );
}

