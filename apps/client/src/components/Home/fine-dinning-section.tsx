import Image from "next/image";

export default function FineDiningSection() {
  return (
    <section className="w-full py-24">
      <div className="max-w-screen-xl mx-auto px-4 xl:px-0">
        <h2
          className="text-3xl md:text-4xl  tracking-widest uppercase mb-4 text-center"
          style={{ color: "#000000" }}
        >
          Fine Dining by the Kosi: A Global & Local Palate
        </h2>
        <p className="text-gray-700 text-base font-serif mb-8 md:mb-12 text-center">
          Dining at Manu Maharani is a journey through flavors. Our culinary
          team blends the rustic, bold spices of Kumaon with sophisticated
          global techniques, all served against the backdrop of the flowing
          river.
        </p>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Dasos */}
          <div className="relative group rounded-lg overflow-hidden">
            <Image
              alt="Dasos"
              className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-105"
              height={600}
              src="https://www.manumaharaniresorts.com/wp-content/uploads/2022/10/pexels-pixabay-533325-scaled-1024x654.jpg"
              width={800}
            />
            <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-8">
              <h3 className="text-2xl font-serif text-white mb-2">
                Dasos – The All-Day Dining Theatre
              </h3>
              <p className="text-white/80">
                A Symphony of Global Flavors From lavish breakfast spreads to à
                la carte excellence, Dasos serves Indian, Continental, and
                authentic Kumaoni delicacies. Large glass facades ensure the
                forest is your constant dining companion.
              </p>
              {/* <button className="border border-white px-4 py-2 text-white uppercase tracking-widest font-medium text-xs hover:bg-white hover:text-black transition w-max">
                View Our Menus
              </button> */}
            </div>
          </div>
          {/* Gurney&apos;s Grill */}
          <div className="relative group rounded-lg overflow-hidden">
            <Image
              alt="Gurney's Grill"
              className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-105"
              height={600}
              src="https://www.manumaharaniresorts.com/wp-content/uploads/2022/09/DSC_9880-scaled-2048x1366.jpg"
              width={800}
            />
            <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-8">
              <h3 className="text-2xl font-serif text-white mb-2">
                Gurney’s Grill
              </h3>
              <p className="text-white/80">
                Al Fresco Evenings & Live Grills Experience the magic of an
                open-fire grill. Savor premium cuts and seasonal vegetables u
              </p>
              {/* <button className="border border-white px-4 py-2 text-white uppercase tracking-widest font-medium text-xs hover:bg-white hover:text-black transition w-max">
                View Our Menus
              </button> */}
            </div>
          </div>
        </div>
      </div>
      <button className="mx-auto block mt-8 border border-black px-6 md:px-8 py-2 md:py-3 text-black tracking-widest font-medium uppercase text-xs md:text-base hover:bg-black hover:text-white transition">
        View Our Menus
      </button>
    </section>
  );
}
