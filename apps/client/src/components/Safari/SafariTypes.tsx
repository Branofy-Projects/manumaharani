const safariTypes = [
  {
    capacity: "Up to 6 passengers",
    description:
      "Experience an intimate wildlife encounter in our open-top Jeep safaris. Perfect for families and small groups, these vehicles offer flexibility to explore narrow forest trails and maximize your chances of spotting elusive wildlife.",
    duration: "3-4 hours",
    features: [
      "Private vehicle for your group",
      "Experienced naturalist guide",
      "Flexible routes within the zone",
      "Better maneuverability in forest tracks",
    ],
    icon: "🚙",
    name: "Jeep Safari",
  },
  {
    capacity: "Up to 16 passengers",
    description:
      "Join fellow wildlife enthusiasts on our spacious Canter safaris. These larger vehicles provide elevated viewing platforms and follow designated routes through the most scenic areas of the reserve.",
    duration: "3-4 hours",
    features: [
      "Shared experience with other guests",
      "Elevated seating for better views",
      "Fixed routes covering major attractions",
      "More economical option",
    ],
    icon: "🚌",
    name: "Canter Safari",
  },
];

export default function SafariTypes() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-2xl  tracking-[0.08em] uppercase md:text-4xl">
            Choose Your Safari Experience
          </h2>
          <p className="mx-auto max-w-2xl text-base text-gray-600 md:text-lg">
            Select the perfect safari style for your adventure
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-2">
          {safariTypes.map((safari, index) => (
            <div
              className="rounded-lg bg-white p-8 shadow-md transition-shadow hover:shadow-xl"
              key={index}
            >
              <div className="mb-4 text-5xl">{safari.icon}</div>
              <h3 className="mb-3 text-xl font-light tracking-wide md:text-2xl">
                {safari.name}
              </h3>
              <div className="mb-4 flex flex-wrap gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-2">
                  <span className="font-semibold">👥</span> {safari.capacity}
                </span>
                <span className="flex items-center gap-2">
                  <span className="font-semibold">⏱️</span> {safari.duration}
                </span>
              </div>
              <p className="mb-6 leading-relaxed text-gray-700">
                {safari.description}
              </p>
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900">Features:</h4>
                <ul className="space-y-1">
                  {safari.features.map((feature, idx) => (
                    <li
                      className="flex items-start gap-2 text-gray-700"
                      key={idx}
                    >
                      <span className="mt-1 text-green-600">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
