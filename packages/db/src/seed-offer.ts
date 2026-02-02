/**
 * Seed script to create a sample offer with all related data
 * Run with: npx tsx src/seed-offer.ts
 */

import { config } from "dotenv";
config({ path: "../../.env" });

import { db, Faqs, OfferFaqs, OfferHighlights, OfferItinerary, Offers } from "./index";

async function seedOffer() {
  console.log("🌱 Starting offer seed...");

  try {
    // Create the main offer (Jim Corbett Safari Experience)
    const [offer] = await db
      .insert(Offers)
      .values({
        active: true,
        booking_notice:
          "Safari permits are limited and subject to availability. Book at least 48 hours in advance to ensure permit availability.",
        cancellation_deadline: "72 hours",
        cancellation_policy: `Full refund available up to 72 hours before the experience starts.
50% refund available between 24-72 hours before the experience.
No refund available within 24 hours of the experience.

Note: Government safari permit fees are non-refundable once issued. In case of permit cancellation by forest authorities due to weather or other reasons, a full refund or rescheduling will be offered.`,
        category: "adventure",
        description: `Experience the thrill of India's oldest and most prestigious national park with our comprehensive Jim Corbett Safari Adventure. This full-day experience takes you deep into the heart of the jungle where you'll have the opportunity to witness incredible wildlife in their natural habitat.

Our expert naturalists and forest guides will accompany you throughout the journey, sharing their extensive knowledge about the park's diverse ecosystem, flora, and fauna. The safari covers multiple zones of the park, each offering unique wildlife sighting opportunities.

Jim Corbett National Park is home to over 650 species of birds, 50 species of mammals, and 33 species of reptiles. The park is most famous for its Bengal tiger population, and while sightings cannot be guaranteed, our experienced guides know the best spots and times for maximum chances.

The experience includes comfortable jeep transfers, all necessary permits, and refreshments. Whether you're a wildlife enthusiast, photographer, or simply looking to connect with nature, this safari offers an enriching and memorable adventure.`,
        discounted_price: "6999",
        duration: "Full Day (8-10 hours)",
        excerpt:
          "Embark on an unforgettable wildlife safari through Jim Corbett National Park. Spot majestic tigers, elephants, and exotic birds in their natural habitat with expert naturalists.",
        free_cancellation: true,
        languages: JSON.stringify(["English", "Hindi"]),
        link: "/junglesafari/book-safari",
        location: "Jim Corbett National Park, Uttarakhand",
        max_group_size: 6,
        meeting_point: "Manu Maharani Resort Lobby",
        meeting_point_details:
          "Meet at the resort lobby at 5:30 AM for morning safari or 2:00 PM for evening safari. Our guide will be holding a sign with the tour name. Please arrive 15 minutes early for registration.",
        meta_description:
          "Book an unforgettable Jim Corbett Safari experience. Spot tigers, elephants & exotic wildlife with expert guides. Full day adventure starting from ₹6,999.",
        meta_title: "Jim Corbett Safari Adventure | Wildlife Experience at Manu Maharani",
        min_group_size: 2,
        name: "Jim Corbett Safari Adventure & Nature Experience",
        original_price: "8500",
        price_per: "person",
        rating: "4.8",
        review_count: 247,
        slug: "jim-corbett-safari-adventure-nature-experience",
        status: "active",
      })
      .returning();

    console.log("✅ Created offer:", offer.id);

    // Create highlights (What's Included)
    const includedHighlights = [
      "Professional English-speaking naturalist guide",
      "Jeep safari with experienced driver",
      "All zone entry permits and fees",
      "Breakfast and packed lunch",
      "Bottled water and refreshments",
      "Binoculars for wildlife spotting",
      "Wildlife identification guide book",
      "Pick-up and drop-off from Manu Maharani Resort",
      "Safari jacket and cap (to keep)",
    ];

    const excludedHighlights = [
      "Camera fees (₹500 extra for professional cameras)",
      "Personal expenses and tips",
      "Travel insurance",
      "Alcoholic beverages",
      "Additional safari zones (can be added at extra cost)",
    ];

    for (let i = 0; i < includedHighlights.length; i++) {
      await db.insert(OfferHighlights).values({
        offer_id: offer.id,
        order: i,
        text: includedHighlights[i],
        type: "included",
      });
    }

    for (let i = 0; i < excludedHighlights.length; i++) {
      await db.insert(OfferHighlights).values({
        offer_id: offer.id,
        order: i,
        text: excludedHighlights[i],
        type: "excluded",
      });
    }

    console.log("✅ Created highlights");

    // Create itinerary
    const itineraryItems = [
      {
        admission_included: false,
        description:
          "Start your adventure with a comfortable pick-up from the resort. Enjoy complimentary tea/coffee and briefing about the day ahead.",
        duration: "30 minutes",
        is_stop: true,
        location: "Manu Maharani Resort",
        title: "Pick-up from Manu Maharani Resort",
      },
      {
        admission_included: true,
        description:
          "Enter the famous Dhikala zone, known for its grasslands and highest tiger sighting probability. Your naturalist will guide you through the diverse terrain.",
        duration: "3 hours",
        is_stop: true,
        location: "Dhikala Zone, Jim Corbett",
        title: "Dhikala Zone Entry & Safari Begins",
      },
      {
        admission_included: true,
        description:
          "Stop at the scenic Ramganga River viewpoint. Excellent spot for photographing crocodiles, gharials, and various water birds.",
        duration: "45 minutes",
        is_stop: true,
        location: "Ramganga Reservoir",
        title: "Ramganga River Viewpoint",
      },
      {
        admission_included: false,
        description:
          "Enjoy a delicious packed lunch at a designated forest rest house. Relax and share your morning sightings with fellow travelers.",
        duration: "1 hour",
        is_stop: true,
        location: "Dhikala Forest Rest House",
        title: "Lunch Break at Forest Rest House",
      },
      {
        admission_included: true,
        description:
          "Continue your adventure in the Bijrani zone, famous for its sal forests and elephant herds. High chances of spotting deer, wild boar, and langurs.",
        duration: "2.5 hours",
        is_stop: true,
        location: "Bijrani Zone, Jim Corbett",
        title: "Afternoon Safari - Bijrani Zone",
      },
      {
        admission_included: false,
        description:
          "Drive through the scenic Kanda Ridge, a popular corridor for wildlife movement between zones.",
        duration: "20 minutes",
        is_stop: false,
        location: "Kanda Ridge",
        title: "Kanda Ridge Pass-Through",
      },
      {
        admission_included: false,
        description:
          "Head back to Manu Maharani Resort with wonderful memories and photographs. Receive your safari certificate and wildlife sighting report.",
        duration: "45 minutes",
        is_stop: true,
        location: "Manu Maharani Resort",
        title: "Return to Resort",
      },
    ];

    for (let i = 0; i < itineraryItems.length; i++) {
      await db.insert(OfferItinerary).values({
        offer_id: offer.id,
        ...itineraryItems[i],
        order: i,
      });
    }

    console.log("✅ Created itinerary");

    // Create FAQs
    const faqData = [
      {
        answer:
          "The park is open from mid-November to mid-June. Winter months (November-February) offer pleasant weather, while summer (March-June) has higher wildlife sighting chances as animals gather near water sources. Monsoon season (July-October) the park is closed.",
        question: "What is the best time to visit Jim Corbett for safari?",
      },
      {
        answer:
          "Wear comfortable, earth-toned clothing (khaki, brown, olive green) that blends with nature. Avoid bright colors and white as they can disturb wildlife. Wear covered shoes, carry a hat, and bring a light jacket as mornings can be cool.",
        question: "What should I wear for the safari?",
      },
      {
        answer:
          "Wildlife sightings cannot be guaranteed as the animals are in their natural habitat. However, our experienced guides know the best spots and timings to maximize your chances. Jim Corbett has one of the highest tiger densities in India.",
        question: "Is tiger sighting guaranteed?",
      },
      {
        answer:
          "Yes, children of all ages are welcome. However, children under 5 years may find the long duration challenging. We recommend the safari for children aged 6 and above for the best experience.",
        question: "Can children participate in the safari?",
      },
      {
        answer:
          "If the forest authorities cancel safari permits due to heavy rain or other conditions, we offer a full refund or free rescheduling to another date of your choice, subject to availability.",
        question: "What happens if the safari is cancelled due to weather?",
      },
      {
        answer:
          "Yes, professional cameras and DSLRs are allowed but require an additional permit fee of ₹500 per camera. Please inform us at the time of booking if you plan to bring professional equipment.",
        question: "Can I bring my professional camera?",
      },
    ];

    // First, create the FAQs in the faqs table
    for (let i = 0; i < faqData.length; i++) {
      const [faq] = await db
        .insert(Faqs)
        .values({
          answer: faqData[i].answer,
          question: faqData[i].question,
        })
        .returning();

      // Then link them to the offer
      await db.insert(OfferFaqs).values({
        faq_id: faq.id,
        offer_id: offer.id,
        order: i,
      });
    }

    console.log("✅ Created FAQs");

    console.log("\n🎉 Seed completed successfully!");
    console.log(`\n📌 Offer created with:`);
    console.log(`   - ID: ${offer.id}`);
    console.log(`   - Slug: ${offer.slug}`);
    console.log(`   - URL: /offers/${offer.slug}`);
    console.log(`   - ${includedHighlights.length} included highlights`);
    console.log(`   - ${excludedHighlights.length} excluded highlights`);
    console.log(`   - ${itineraryItems.length} itinerary items`);
    console.log(`   - ${faqData.length} FAQs`);
  } catch (error) {
    console.error("❌ Error seeding offer:", error);
    throw error;
  }

  process.exit(0);
}

seedOffer();
