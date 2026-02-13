const faqs = [
  {
    answer:
      "The best time is from November to June when the park is open. Winter months (November-February) offer pleasant weather, while summer (April-June) provides better tiger sightings near water sources.",
    question: "What is the best time to visit for a jungle safari?",
  },
  {
    answer:
      "Morning safaris start at sunrise (around 6:00 AM) and evening safaris begin around 3:00 PM. Exact timings vary by season and zone.",
    question: "What are the safari timings?",
  },
  {
    answer:
      "Yes, advance booking is mandatory. You can book directly through the official Corbett Tiger Reserve website or authorized booking partners. We recommend booking at least 45-60 days in advance during peak season.",
    question: "Is advance booking required?",
  },
  {
    answer:
      "Children of all ages are welcome on safaris. However, we recommend that parents ensure young children remain quiet during the safari to not disturb the wildlife. Children below 5 years may enter free of cost.",
    question: "Are children allowed on safaris?",
  },
  {
    answer:
      "While tiger sightings cannot be guaranteed as they are wild animals, Corbett has one of the highest densities of tigers in India. Your chances improve significantly during summer months when tigers frequent water sources.",
    question: "What are the chances of spotting a tiger?",
  },
  {
    answer:
      "We provide binoculars and wildlife guidebooks. Bring sunscreen, a hat, sunglasses, comfortable shoes, and a light jacket for early morning safaris. Cameras are allowed without flash.",
    question: "What should I bring on the safari?",
  },
];

export default function SafariFAQ() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-2xl  tracking-[0.08em] uppercase md:text-4xl">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="mx-auto max-w-3xl space-y-4">
          {faqs.map((faq, index) => (
            <details
              className="group rounded-lg bg-[#f3eee7] p-6 transition-all hover:shadow-md"
              key={index}
            >
              <summary className="flex cursor-pointer items-center justify-between font-semibold text-gray-900">
                <span>{faq.question}</span>
                <span className="text-2xl transition-transform group-open:rotate-180">
                  ↓
                </span>
              </summary>
              <p className="mt-4 leading-relaxed text-gray-700">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

