import Image from "next/image";
import Link from "next/link";

const safariZones = [
  {
    description:
      "Where the Wilderness Beckons, Offering a Blend of Dense Sal Forests, Grasslands, and Rich Biodiversity.",
    distance: "7km",
    entryGate: "Amdanda",
    highlights: ["Tigers", "Elephants", "Gharials", "Over 600 bird species"],
    image:
      "https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?q=80&w=1600&auto=format&fit=crop",
    name: "Bijrani Zone",
    timings: {
      afternoon: "1:30 to 5:00",
      morning: "6:30 to 9:30",
    },
  },
  {
    description:
      "Southern Corbett's Wildlife Oasis, Where Enthusiasts Encounter Diverse Fauna Amidst Lush Grasslands and Dense Forests.",
    distance: "25km",
    entryGate: "Dhela",
    highlights: ["Dense Forests", "River Crossing", "Tigers", "Wild Boars"],
    image:
      "https://images.unsplash.com/photo-1549366021-9f761d450615?q=80&w=1600&auto=format&fit=crop",
    name: "Jhirna Zone",
    timings: {
      afternoon: "1:30 to 5:00",
      morning: "6:30 to 9:30",
    },
  },
  {
    description:
      "Reopens on November 15th, offering a chance to witness the grandeur of Corbett Tiger Reserve's wilderness.",
    distance: "25km",
    entryGate: "Dhangari",
    highlights: ["Grasslands", "Wild Elephants", "Leopards", "Deer species"],
    image:
      "https://images.unsplash.com/photo-1535083783855-76ae62b2914e?q=80&w=1600&auto=format&fit=crop",
    name: "Dhikala Zone",
    timings: {
      afternoon: "1:30 to 5:00",
      morning: "6:30 to 9:30",
    },
  },
  {
    description:
      "An Idyllic Hill Safari Zone Offering Wildlife Beauty, Adventure, and Serenity.",
    distance: "8km",
    entryGate: "Durgadevi",
    highlights: [
      "Pristine Forest",
      "Hill Safari",
      "Rare Sightings",
      "Photography",
    ],
    image:
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=1600&auto=format&fit=crop",
    name: "Durgadevi Zone",
    timings: {
      afternoon: "1:30 to 5:00",
      morning: "6:30 to 9:30",
    },
  },
  {
    description:
      "A Year-Round Eco-Tourism Haven with Abundant Flora, Fauna, and Wildlife Wonders.",
    distance: "25km",
    entryGate: "Dhela",
    highlights: ["Year-Round", "Eco-Tourism", "Abundant Flora", "Wildlife"],
    image:
      "https://images.unsplash.com/photo-1564760055775-d63b17a55c44?q=80&w=1600&auto=format&fit=crop",
    name: "Dhela Zone",
    timings: {
      afternoon: "1:30 to 5:00",
      morning: "6:30 to 9:30",
    },
  },
  {
    description:
      "Where Nature's Splendor and Tiger Territory Converge for an Enthralling Experience.",
    distance: "4km",
    entryGate: "Ringora",
    highlights: ["Tiger Territory", "Nature's Splendor", "Diverse Wildlife"],
    image:
      "https://images.unsplash.com/photo-1551316679-9c6ae9dec224?q=80&w=1600&auto=format&fit=crop",
    name: "Garjiya Zone",
    timings: {
      afternoon: "1:30 to 5:00",
      morning: "6:30 to 9:30",
    },
  },
  {
    description:
      "Explore the Serene Side of Corbett Tiger Reserve, Where Tranquil Forests and Abundant Wildlife Await in Nature's Embrace.",
    distance: "40km",
    entryGate: "Vatanvasa",
    highlights: ["Tranquil Forests", "Abundant Wildlife", "Serene Beauty"],
    image:
      "https://images.unsplash.com/photo-1503066211613-c17ebc9daef0?q=80&w=1600&auto=format&fit=crop",
    name: "Sonanadi Zone",
    timings: {
      afternoon: "1:30 to 5:00",
      morning: "6:30 to 9:30",
    },
  },
  {
    description:
      "A Gateway to Pristine Wilderness and Diverse Wildlife Adventures in Corbett Tiger Reserve.",
    distance: "40km",
    entryGate: "Pakhro",
    highlights: [
      "Pristine Wilderness",
      "Diverse Wildlife",
      "Adventure",
      "Gateway",
    ],
    image:
      "https://images.unsplash.com/photo-1602491453631-e2a5ad90a131?q=80&w=1600&auto=format&fit=crop",
    name: "Pakhro Zone",
    timings: {
      afternoon: "1:30 to 5:00",
      morning: "6:30 to 9:30",
    },
  },
];

export default function SafariZones() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-2xl font-thin tracking-[0.08em] uppercase md:text-4xl">
            Safari Zones
          </h2>
          <p className="mx-auto max-w-2xl font-serif text-base text-gray-600 md:text-lg">
            Corbett Tiger Reserve is divided into eight unique tourism zones,
            each with its own charm and distinct wildlife. Here&apos;s a quick
            guide to help you choose
          </p>
        </div>

        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {safariZones.map((zone, index) => (
            <div
              className="group overflow-hidden rounded-lg bg-white transition-all hover:shadow-xl"
              key={index}
            >
              <div className="relative h-[220px] overflow-hidden">
                <Image
                  alt={zone.name}
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  fill
                  src={zone.image}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="mb-1 text-xs italic text-white/90">
                    Entry Gate: {zone.entryGate}
                  </p>
                  <h3 className="text-lg font-semibold tracking-wide text-white">
                    {zone.name}
                  </h3>
                </div>
              </div>
              <div className="p-4">
                <p className="mb-4 text-sm leading-relaxed text-gray-700">
                  {zone.description}
                </p>

                {/* Timings */}
                <div className="mb-4 space-y-2 rounded-lg bg-[#f3eee7] p-3">
                  <div className="flex items-center gap-2 text-xs text-gray-700">
                    <span className="text-base">☀️</span>
                    <div>
                      <span className="font-semibold">Morning:</span>{" "}
                      {zone.timings.morning}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-700">
                    <span className="text-base">🌅</span>
                    <div>
                      <span className="font-semibold">Afternoon:</span>{" "}
                      {zone.timings.afternoon}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-700">
                    <span className="text-base">📍</span>
                    <div>
                      <span className="font-semibold">Distance:</span>{" "}
                      {zone.distance}
                    </div>
                  </div>
                </div>

                {/* Highlights */}
                <div className="mb-4">
                  <h4 className="mb-2 text-xs font-semibold text-gray-900">
                    Wildlife Highlights:
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {zone.highlights.map((highlight, idx) => (
                      <span
                        className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700"
                        key={idx}
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>

                <Link
                  className="block w-full rounded-lg border border-gray-900 bg-transparent px-4 py-2 text-center text-xs font-semibold uppercase tracking-wide text-gray-900 transition-all hover:bg-gray-900 hover:text-white"
                  href={`/junglesafari/book-safari?zone=${encodeURIComponent(zone.name)}`}
                >
                  Book Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
