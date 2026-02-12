/**
 * Seed script to create 2 sample events with all related data
 * Run with: npx tsx src/seed-events.ts
 */

import { config } from "dotenv";
config({ path: "../../.env" });

import { db, eq, EventFaqs, EventHighlights, EventItinerary, Events, Faqs, inArray } from "./index";

function getDateString(daysFromNow: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().split("T")[0];
}

async function seedEvents() {
  console.log("🌱 Starting events seed...");

  try {
    // ==================== EVENT 1: Tomorrow ====================
    const event1Values = {
      active: true,
      booking_notice:
        "Please book at least 12 hours in advance. Limited spots available.",
      cancellation_deadline: "24 hours",
      cancellation_policy:
        "Full refund available up to 24 hours before the event. No refund within 24 hours of the event.",
      category: "cultural" as const,
      description: `Join us for a magical evening under the stars at Manu Maharani Resort. This curated cultural night brings together the finest folk artists of Kumaon to showcase traditional dance forms, live music, and storytelling that have been passed down through generations.

The evening begins with a welcome drink on the terrace overlooking the Nainital hills, followed by performances featuring Choliya dance, Jhora folk songs, and a mesmerizing Kumaoni Ramlila excerpt. Our resident cultural expert will provide context and history behind each performance.

A lavish Kumaoni dinner buffet featuring authentic local delicacies like Bhatt ki Churkani, Aloo ke Gutke, Singal, and traditional Bal Mithai for dessert rounds off this immersive cultural experience.`,
      discounted_price: "2499",
      duration: "4 hours",
      endDate: getDateString(1),
      endTime: "22:00",
      excerpt:
        "An enchanting evening of Kumaoni folk dance, live music, and authentic local cuisine under the starlit Nainital sky.",
      free_cancellation: true,
      languages: JSON.stringify(["English", "Hindi"]),
      link: "/events/kumaoni-cultural-night",
      location: "Manu Maharani Resort, Garden Terrace",
      max_group_size: 50,
      meeting_point: "Resort Lobby",
      meeting_point_details:
        "Gather at the resort lobby at 5:45 PM. Our cultural coordinator will guide you to the Garden Terrace. Smart casual attire recommended.",
      meta_description:
        "Experience an authentic Kumaoni Cultural Night at Manu Maharani Resort. Folk dance, live music & traditional dinner. Book now for ₹2,499.",
      meta_title: "Kumaoni Cultural Night | Manu Maharani Resort Nainital",
      min_group_size: 2,
      name: "Kumaoni Cultural Night & Traditional Dinner",
      original_price: "3500",
      price_per: "person",
      rating: "4.7",
      review_count: 89,
      slug: "kumaoni-cultural-night-traditional-dinner",
      startDate: getDateString(1),
      startTime: "18:00",
      status: "active" as const,
    };

    const [event1] = await db
      .insert(Events)
      .values(event1Values)
      .onConflictDoUpdate({
        target: Events.slug,
        set: event1Values,
      })
      .returning();

    console.log("✅ Created Event 1:", event1.id, "-", event1.name);

    // Clean up existing related data
    await db.delete(EventHighlights).where(eq(EventHighlights.event_id, event1.id));
    await db.delete(EventItinerary).where(eq(EventItinerary.event_id, event1.id));
    const linked1 = await db.select({ faq_id: EventFaqs.faq_id }).from(EventFaqs).where(eq(EventFaqs.event_id, event1.id));
    await db.delete(EventFaqs).where(eq(EventFaqs.event_id, event1.id));
    if (linked1.length > 0) {
      await db.delete(Faqs).where(inArray(Faqs.id, linked1.map(f => f.faq_id)));
    }

    // Highlights
    const e1Included = [
      "Welcome drink on arrival",
      "Live Kumaoni folk dance & music performances",
      "Cultural storytelling session with local historian",
      "Authentic Kumaoni dinner buffet",
      "Complimentary souvenir bookmark with Kumaoni art",
    ];
    const e1Excluded = [
      "Alcoholic beverages (available for purchase)",
      "Personal photography equipment",
      "Transportation outside the resort",
    ];

    for (let i = 0; i < e1Included.length; i++) {
      await db.insert(EventHighlights).values({ event_id: event1.id, order: i, text: e1Included[i], type: "included" });
    }
    for (let i = 0; i < e1Excluded.length; i++) {
      await db.insert(EventHighlights).values({ event_id: event1.id, order: i, text: e1Excluded[i], type: "excluded" });
    }
    console.log("  ✅ Highlights created");

    // Itinerary
    const e1Itinerary = [
      { description: "Arrive at the Garden Terrace and enjoy a welcome cocktail or mocktail while soaking in the evening views.", duration: "30 min", is_stop: true, location: "Garden Terrace", title: "Welcome Drinks & Sunset Views" },
      { description: "Watch the vibrant Choliya dance and Jhora folk performances by local artists from the hills of Kumaon.", duration: "1 hour", is_stop: true, location: "Open Air Stage", title: "Folk Dance & Music Performances" },
      { description: "Our resident historian shares fascinating tales of Kumaon's rich heritage, the Chand dynasty, and local legends.", duration: "30 min", is_stop: true, location: "Fireside Lounge", title: "Kumaoni Storytelling Session" },
      { description: "Savour a lavish buffet featuring Bhatt ki Churkani, Aloo ke Gutke, Singal, and more authentic Kumaoni dishes.", duration: "1.5 hours", is_stop: true, location: "Dining Pavilion", title: "Traditional Kumaoni Dinner Buffet" },
      { description: "End the evening with live acoustic music and Bal Mithai dessert under the stars.", duration: "30 min", is_stop: true, location: "Garden Terrace", title: "Dessert & Acoustic Finale" },
    ];

    for (let i = 0; i < e1Itinerary.length; i++) {
      await db.insert(EventItinerary).values({ event_id: event1.id, order: i, ...e1Itinerary[i] });
    }
    console.log("  ✅ Itinerary created");

    // FAQs
    const e1Faqs = [
      { answer: "Smart casual attire is recommended. The event is outdoors, so a light jacket is advisable for the evening breeze.", question: "What is the dress code?" },
      { answer: "Yes, children aged 5 and above are welcome. Children under 12 get a 50% discount.", question: "Is this event suitable for children?" },
      { answer: "The event takes place rain or shine. In case of rain, performances move to the indoor banquet hall.", question: "What happens if it rains?" },
    ];

    for (let i = 0; i < e1Faqs.length; i++) {
      const [faq] = await db.insert(Faqs).values({ answer: e1Faqs[i].answer, question: e1Faqs[i].question }).returning();
      await db.insert(EventFaqs).values({ event_id: event1.id, faq_id: faq.id, order: i });
    }
    console.log("  ✅ FAQs created");

    // ==================== EVENT 2: Day After Tomorrow ====================
    const event2Values = {
      active: true,
      booking_notice:
        "Advance booking required. Maximum 20 participants per batch for a personalised experience.",
      cancellation_deadline: "48 hours",
      cancellation_policy:
        "Full refund up to 48 hours before the event. 50% refund between 24-48 hours. No refund within 24 hours.",
      category: "adventure" as const,
      description: `Discover the breathtaking Nainital landscape on this guided sunrise trek to the iconic Tiffin Top (Dorothy's Seat). Starting from Manu Maharani Resort in the early morning, our experienced mountain guide leads you through pine and oak forests as the first light paints the Himalayan peaks in shades of gold and pink.

At the summit, enjoy panoramic 360-degree views of Nainital Lake, the snow-capped Himalayan range, and the lush Kumaon valleys. A hot breakfast is served at the top — freshly brewed mountain tea, parathas, and eggs — making this a truly unforgettable morning.

The trek is moderate difficulty and suitable for beginners with reasonable fitness. All safety equipment and first-aid support is provided. Our naturalist guide also points out native bird species, Himalayan flora, and local geological features along the trail.`,
      discounted_price: "1999",
      duration: "5 hours",
      endDate: getDateString(2),
      endTime: "10:30",
      excerpt:
        "A guided sunrise trek to Tiffin Top with panoramic Himalayan views and hot breakfast at the summit. Perfect for nature lovers and adventure seekers.",
      free_cancellation: true,
      languages: JSON.stringify(["English", "Hindi"]),
      link: "/events/sunrise-trek-tiffin-top",
      location: "Tiffin Top (Dorothy's Seat), Nainital",
      max_group_size: 20,
      meeting_point: "Resort Main Gate",
      meeting_point_details:
        "Meet at the resort main gate at 5:15 AM sharp. Wear comfortable trekking shoes and layered clothing. Torches will be provided.",
      meta_description:
        "Join the Sunrise Trek to Tiffin Top from Manu Maharani Resort. Guided Himalayan trek with breakfast at the summit. Book for ₹1,999.",
      meta_title: "Sunrise Trek to Tiffin Top | Adventure at Manu Maharani",
      min_group_size: 4,
      name: "Sunrise Trek to Tiffin Top with Breakfast",
      original_price: "2500",
      price_per: "person",
      rating: "4.9",
      review_count: 156,
      slug: "sunrise-trek-tiffin-top-breakfast",
      startDate: getDateString(2),
      startTime: "05:30",
      status: "active" as const,
    };

    const [event2] = await db
      .insert(Events)
      .values(event2Values)
      .onConflictDoUpdate({
        target: Events.slug,
        set: event2Values,
      })
      .returning();

    console.log("✅ Created Event 2:", event2.id, "-", event2.name);

    // Clean up existing related data
    await db.delete(EventHighlights).where(eq(EventHighlights.event_id, event2.id));
    await db.delete(EventItinerary).where(eq(EventItinerary.event_id, event2.id));
    const linked2 = await db.select({ faq_id: EventFaqs.faq_id }).from(EventFaqs).where(eq(EventFaqs.event_id, event2.id));
    await db.delete(EventFaqs).where(eq(EventFaqs.event_id, event2.id));
    if (linked2.length > 0) {
      await db.delete(Faqs).where(inArray(Faqs.id, linked2.map(f => f.faq_id)));
    }

    // Highlights
    const e2Included = [
      "Experienced mountain guide & naturalist",
      "Trekking poles and torches",
      "Hot breakfast at the summit (tea, parathas, eggs)",
      "First-aid kit and safety support",
      "Bird-watching binoculars",
      "Certificate of completion",
    ];
    const e2Excluded = [
      "Trekking shoes (available for rent at ₹200)",
      "Personal snacks and water bottles",
      "Travel insurance",
    ];

    for (let i = 0; i < e2Included.length; i++) {
      await db.insert(EventHighlights).values({ event_id: event2.id, order: i, text: e2Included[i], type: "included" });
    }
    for (let i = 0; i < e2Excluded.length; i++) {
      await db.insert(EventHighlights).values({ event_id: event2.id, order: i, text: e2Excluded[i], type: "excluded" });
    }
    console.log("  ✅ Highlights created");

    // Itinerary
    const e2Itinerary = [
      { description: "Assemble at the resort main gate. Quick safety briefing and distribution of trekking poles and torches.", duration: "15 min", is_stop: true, location: "Resort Main Gate", title: "Assembly & Safety Briefing" },
      { description: "Begin the trek through a scenic pine forest trail. The guide points out early morning bird calls and native flora.", duration: "1.5 hours", is_stop: false, location: "Pine Forest Trail", title: "Forest Trail Ascent" },
      { description: "Brief stop at a clearing with beautiful views of Nainital Lake below. Great photo opportunity as dawn light hits the lake.", duration: "15 min", is_stop: true, location: "Lake View Point", title: "Lake View Rest Stop" },
      { description: "Final push through oak forest to reach Tiffin Top. Watch the sun rise over the Himalayan peaks.", duration: "45 min", is_stop: true, location: "Tiffin Top", title: "Summit & Sunrise" },
      { description: "Enjoy a hot breakfast at 2292m — fresh mountain tea, stuffed parathas, boiled eggs, and seasonal fruits.", duration: "45 min", is_stop: true, location: "Tiffin Top", title: "Breakfast at the Summit" },
      { description: "Leisurely descent back to the resort via an alternate scenic route through rhododendron groves.", duration: "1.5 hours", is_stop: false, location: "Rhododendron Trail", title: "Descent via Scenic Route" },
    ];

    for (let i = 0; i < e2Itinerary.length; i++) {
      await db.insert(EventItinerary).values({ event_id: event2.id, order: i, ...e2Itinerary[i] });
    }
    console.log("  ✅ Itinerary created");

    // FAQs
    const e2Faqs = [
      { answer: "The trek is moderate difficulty, covering about 4 km with a 400m elevation gain. Anyone with basic fitness can complete it comfortably.", question: "How difficult is the trek?" },
      { answer: "Wear layered clothing — it's cold at dawn but warms up as you trek. Sturdy shoes with grip are essential. We provide trekking poles and torches.", question: "What should I wear and bring?" },
      { answer: "Children aged 10 and above can participate. They must be accompanied by a parent/guardian at all times.", question: "Can children join the trek?" },
      { answer: "The trek proceeds in light rain with waterproof ponchos provided. In case of heavy rain or unsafe conditions, it will be rescheduled with a full refund.", question: "What if there's bad weather?" },
    ];

    for (let i = 0; i < e2Faqs.length; i++) {
      const [faq] = await db.insert(Faqs).values({ answer: e2Faqs[i].answer, question: e2Faqs[i].question }).returning();
      await db.insert(EventFaqs).values({ event_id: event2.id, faq_id: faq.id, order: i });
    }
    console.log("  ✅ FAQs created");

    // Summary
    console.log("\n🎉 Seed completed successfully!");
    console.log(`\n📌 Event 1: ${event1.name}`);
    console.log(`   - ID: ${event1.id}`);
    console.log(`   - Date: ${event1.startDate} (${event1.startTime} - ${event1.endTime})`);
    console.log(`   - Slug: ${event1.slug}`);
    console.log(`\n📌 Event 2: ${event2.name}`);
    console.log(`   - ID: ${event2.id}`);
    console.log(`   - Date: ${event2.startDate} (${event2.startTime} - ${event2.endTime})`);
    console.log(`   - Slug: ${event2.slug}`);
  } catch (error) {
    console.error("❌ Error seeding events:", error);
    throw error;
  }

  process.exit(0);
}

seedEvents();
