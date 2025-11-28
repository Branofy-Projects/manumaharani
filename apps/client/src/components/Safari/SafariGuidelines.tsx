const guidelines = [
  {
    icon: "⏰",
    text: "Arrive 30 minutes before safari time",
    title: "Timing",
  },
  {
    icon: "🎫",
    text: "Carry valid ID proof and booking confirmation",
    title: "Documents",
  },
  {
    icon: "📸",
    text: "Photography allowed without flash",
    title: "Photography",
  },
  {
    icon: "🤫",
    text: "Maintain silence to not disturb wildlife",
    title: "Silence",
  },
  {
    icon: "🚫",
    text: "No smoking, alcohol, or plastic inside the reserve",
    title: "Restrictions",
  },
  {
    icon: "👕",
    text: "Wear neutral colors and comfortable clothing",
    title: "Dress Code",
  },
];

export default function SafariGuidelines() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-2xl font-thin tracking-[0.08em] uppercase md:text-4xl">
            Safari Guidelines
          </h2>
          <p className="mx-auto max-w-2xl text-base text-gray-600 md:text-lg">
            Essential information for a safe and enjoyable experience
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {guidelines.map((guideline, index) => (
            <div
              className="rounded-lg bg-[#f3eee7] p-6 text-center transition-transform hover:scale-105"
              key={index}
            >
              <div className="mb-3 text-4xl">{guideline.icon}</div>
              <h3 className="mb-2 font-semibold text-gray-900">
                {guideline.title}
              </h3>
              <p className="text-sm text-gray-700">{guideline.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-lg bg-amber-50 p-6 text-center">
          <p className="text-sm text-amber-900">
            <span className="font-semibold">Important:</span> The park remains
            closed from mid-June to mid-November during the monsoon season.
            Please check official notifications before planning your visit.
          </p>
        </div>
      </div>
    </section>
  );
}

