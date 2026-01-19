import Image from "next/image";

export default function JimCorbett() {
  return (
    <section className="w-full bg-[#000000] py-24 flex justify-center items-center">
      <div className="max-w-screen-xl mx-auto w-full flex flex-col md:flex-row items-center justify-between px-6 gap-12">
        {/* Left: Text */}
        <div className="flex-1 flex flex-col justify-center items-start max-w-xl">
          <h2 className="text-3xl md:text-4xl font-thin tracking-widest text-[#b68833] mb-8">
            Beyond the Safari: The Modern Utility of Jim Corbett
          </h2>
          <p className="text-lg mb-8 font-serif text-gray-200 leading-relaxed">
            In an age of digital saturation, Jim Corbett National Park serves as
            a vital ecological &quot;reset&quot; for the modern soul. India’s
            first national park is no longer just a destination for spotting the
            Bengal Tiger; it is a classroom for conservation and a sanctuary for
            mental well-being
          </p>
          <h3 className="text-xl md:text-2xl font-thin tracking-widest text-[#b68833] mb-4">
            Takeaway Experiences:
          </h3>
          <ul className="font-serif text-gray-200 leading-relaxed list-disc list-inside space-y-2">
            <li>
              <b>Ecological Awareness:</b> Witness the intricate balance of the
              Terai ecosystem, from the majestic elephants to over 600 species
              of birds.
            </li>
            <li>
              <b>Digital Detox:</b> Trade screen time for &quot;forest
              bathing,&quot; using the park’s vast 1,300 sq km expanse to
              reconnect with the natural world.
            </li>
            <li>
              <b>Adventure with Purpose:</b> Our guided safaris to Bijrani and
              Dhikala are led by experts who transform a simple drive into a
              deep dive into wildlife biology and environmental stewardship.
            </li>
          </ul>

          {/* <button className="border border-[#b68833] bg-transparent text-[#b68833] px-8 py-3 uppercase tracking-widest font-medium text-base hover:bg-white hover:text-[#000000] transition">
            Discover More
          </button> */}
        </div>
        {/* Right: Tiger Illustration */}
        <div className="flex-1 flex justify-center items-center">
          <Image
            alt="Tiger Illustration"
            className="max-w-sm w-full h-auto object-contain"
            height={400}
            src="/tiger.png"
            style={{ filter: "drop-shadow(0 4px 24px rgba(0,0,0,0.2))" }}
            width={400}
          />
        </div>
      </div>
    </section>
  );
}
