import Image from "next/image";

export default function WeddingAiManuMaharani() {
  return (
    <section className="w-full py-24 ">
      <div className="max-w-screen-xl mx-auto px-4 xl:px-0">
        <h2
          className="text-3xl md:text-4xl font-thin tracking-widest uppercase mb-4 text-center"
          style={{ color: "#000000" }}
        >
          Grand Riverside Weddings & Corporate Excellence
        </h2>
        <p className="text-gray-700 text-base font-serif mb-8 md:mb-12 text-center">
          Transform your milestone moments into legends. With expansive
          riverside lawns and sophisticated indoor venues, Manu Maharani is the
          premier choice for destination weddings in Jim Corbett. From intimate
          "Mehendi" ceremonies by the Kosi to high-level corporate offsites that
          inspire innovation, we provide the infrastructure and the "Atithi Devo
          Bhavah" service to make every event seamless.
        </p>
      </div>

      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mx-auto">
        {/* Card 1 */}
        <div className="flex flex-col h-full bg-white overflow-hidden">
          <Image
            alt="Wedding 1"
            className="w-full h-80 object-cover object-center"
            height={400}
            src="https://images.unsplash.com/flagged/photo-1572534779127-b64758946728?auto=format&fit=crop&w=600&q=80"
            width={600}
          />
          <div className="bg-[#000000] text-[#b68833] text-center py-3 text-lg font-serif tracking-widest flex flex-col items-center justify-center">
            <span className="text-xs font-sans tracking-normal mb-1">
              ELLE x
            </span>
            <span className="text-base font-serif">MANU MAHARANI</span>
          </div>
        </div>
        {/* Card 2 */}
        <div className="flex flex-col h-full bg-white overflow-hidden">
          <Image
            alt="Wedding 2"
            className="w-full h-80 object-cover object-center"
            height={400}
            src="https://images.unsplash.com/photo-1587271636175-90d58cdad458?auto=format&fit=crop&w=600&q=80"
            width={600}
          />
          <div className="bg-[#000000] text-[#b68833] text-center py-3 text-lg font-serif tracking-widest flex flex-col items-center justify-center">
            <span className="text-xs font-sans tracking-normal mb-1">
              BRIDES x
            </span>
            <span className="text-base font-serif">MANU MAHARANI</span>
          </div>
        </div>
        {/* Card 3 */}
        <div className="flex flex-col h-full bg-white overflow-hidden">
          <Image
            alt="Wedding 3"
            className="w-full h-80 object-cover object-center"
            height={400}
            src="https://www.manumaharaniresorts.com/wp-content/uploads/2024/04/romantic-getaway-1.webp"
            width={600}
          />
          <div className="bg-[#000000] text-[#b68833] text-center py-3 text-lg font-serif tracking-widest flex flex-col items-center justify-center">
            <span className="text-xs font-sans tracking-normal mb-1">
              TRAVEL+LEISURE x
            </span>
            <span className="text-base font-serif">MANU MAHARANI</span>
          </div>
        </div>
        {/* Card 4 */}
        <div className="flex flex-col h-full bg-white overflow-hidden">
          <Image
            alt="Wedding 4"
            className="w-full h-80 object-cover object-center"
            height={400}
            src="https://images.unsplash.com/photo-1587271407850-8d438ca9fdf2?auto=format&fit=crop&w=600&q=80"
            width={600}
          />
          <div className="bg-[#000000] text-[#b68833] text-center py-3 text-lg font-serif tracking-widest flex flex-col items-center justify-center">
            <span className="text-xs font-sans tracking-normal mb-1">
              VOGUE x
            </span>
            <span className="text-base font-serif">MANU MAHARANI</span>
          </div>
        </div>
      </div>
      <button className="mx-auto block mt-8 border border-black px-6 md:px-8 py-2 md:py-3 text-black tracking-widest font-medium uppercase text-xs md:text-base hover:bg-black hover:text-white transition">
        Plan Your Event
      </button>
    </section>
  );
}
