/**
 * Seed script to create 3 sample rooms with images and amenities
 * Run with: npx tsx src/seed-rooms.ts
 */

import { config } from "dotenv";
config({ path: "../../.env" });

import { Amenities, db, eq, Images, inArray, RoomAmenities, RoomImages, Rooms } from "./index";

const ROOM_IMAGES = {
  deluxe: [
    "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200",
    "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200",
  ],
  executive: [
    "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200",
    "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200",
    "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=1200",
  ],
  suite: [
    "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1200",
    "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200",
    "https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?w=1200",
  ],
};

const AMENITY_DATA = [
  { icon: "wifi", label: "Free Wi-Fi" },
  { icon: "tv", label: "Flat Screen TV" },
  { icon: "snowflake", label: "Air Conditioning" },
  { icon: "bath", label: "Bathtub" },
  { icon: "coffee", label: "Tea/Coffee Maker" },
  { icon: "lock", label: "In-Room Safe" },
  { icon: "shirt", label: "Laundry Service" },
  { icon: "phone", label: "Direct Dial Phone" },
  { icon: "wind", label: "Hair Dryer" },
  { icon: "refrigerator", label: "Mini Fridge" },
];

async function createImage(url: string, alt: string) {
  const [img] = await db.insert(Images).values({
    alt_text: alt,
    large_url: url,
    medium_url: url,
    original_url: url,
    small_url: url,
  }).returning();
  return img!;
}

async function seedRooms() {
  console.log("🌱 Starting rooms seed...\n");

  try {
    // ==================== CLEANUP ====================
    console.log("🧹 Cleaning up existing seed data...");

    const existingSlugs = ["deluxe-riverside-room", "executive-suite", "premium-cottage"];
    const existingRooms = await db
      .select({ id: Rooms.id })
      .from(Rooms)
      .where(inArray(Rooms.slug, existingSlugs));

    if (existingRooms.length > 0) {
      const roomIds = existingRooms.map((r) => r.id);
      await db.delete(RoomAmenities).where(inArray(RoomAmenities.room_id, roomIds));
      await db.delete(RoomImages).where(inArray(RoomImages.room_id, roomIds));
      await db.delete(Rooms).where(inArray(Rooms.id, roomIds));
    }

    // ==================== AMENITIES ====================
    console.log("📦 Seeding amenities...");

    const amenityIds: number[] = [];
    for (const a of AMENITY_DATA) {
      // Upsert: check if amenity with this label already exists
      const existing = await db
        .select({ id: Amenities.id })
        .from(Amenities)
        .where(eq(Amenities.label, a.label))
        .limit(1);

      if (existing.length > 0) {
        amenityIds.push(existing[0]!.id);
      } else {
        const [created] = await db.insert(Amenities).values(a).returning();
        amenityIds.push(created!.id);
      }
    }
    console.log(`  ✅ ${amenityIds.length} amenities ready\n`);

    // ==================== ROOM 1: Deluxe Riverside Room ====================
    console.log("🏨 Creating Room 1: Deluxe Riverside Room...");

    const featuredImg1 = await createImage(ROOM_IMAGES.deluxe[0]!, "Deluxe Riverside Room");
    const [room1] = await db.insert(Rooms).values({
      base_price: "5500.00",
      bed_type: "queen",
      check_in_time: "14:00",
      check_out_time: "11:00",
      children_policy: "Children of all ages are welcome. Extra bed for children above 6 years at additional charge.",
      description:
        "Wake up to the soothing sounds of the river in our Deluxe Riverside Room. Featuring a private balcony overlooking the Kosi river, this spacious room blends rustic charm with modern comforts. The room is tastefully furnished with local Kumaoni artwork and offers panoramic views of the surrounding Sal forests.",
      extra_beds: "One extra bed available on request at ₹1,200 per night.",
      image: featuredImg1.id,
      is_featured: 1,
      max_occupancy: 3,
      number_of_beds: 1,
      order: 0,
      peak_season_price: "7500.00",
      rating: "4.5",
      review_count: 42,
      size_sqft: 350,
      slug: "deluxe-riverside-room",
      status: "available",
      title: "Deluxe Riverside Room",
      weekend_price: "6500.00",
    }).returning();

    // Gallery images
    for (let i = 0; i < ROOM_IMAGES.deluxe.length; i++) {
      const galleryImg = await createImage(ROOM_IMAGES.deluxe[i]!, `Deluxe Riverside Room - View ${i + 1}`);
      await db.insert(RoomImages).values({
        image_id: galleryImg.id,
        order: i,
        room_id: room1!.id,
      });
    }

    // Amenities (first 7)
    for (let i = 0; i < 7; i++) {
      await db.insert(RoomAmenities).values({
        amenity_id: amenityIds[i]!,
        order: i,
        room_id: room1!.id,
      });
    }
    console.log("  ✅ Room 1 created with 3 images and 7 amenities\n");

    // ==================== ROOM 2: Executive Suite ====================
    console.log("🏨 Creating Room 2: Executive Suite...");

    const featuredImg2 = await createImage(ROOM_IMAGES.executive[0]!, "Executive Suite");
    const [room2] = await db.insert(Rooms).values({
      base_price: "9500.00",
      bed_type: "king",
      check_in_time: "14:00",
      check_out_time: "12:00",
      children_policy: "Children welcome. Complimentary extra bed for one child below 8 years.",
      description:
        "Experience luxury in our Executive Suite, the crown jewel of Manu Maharani. This expansive suite features a separate living area, a king-sized bed with premium linens, and a marble bathroom with both rain shower and soaking tub. The private terrace offers uninterrupted views of the Jim Corbett National Park boundary, where you might spot wildlife at dawn.",
      extra_beds: "One extra bed available on request at ₹1,500 per night.",
      image: featuredImg2.id,
      is_featured: 1,
      max_occupancy: 4,
      number_of_beds: 1,
      order: 1,
      peak_season_price: "13500.00",
      rating: "4.8",
      review_count: 28,
      size_sqft: 550,
      slug: "executive-suite",
      status: "available",
      title: "Executive Suite",
      weekend_price: "11000.00",
    }).returning();

    // Gallery images
    for (let i = 0; i < ROOM_IMAGES.executive.length; i++) {
      const galleryImg = await createImage(ROOM_IMAGES.executive[i]!, `Executive Suite - View ${i + 1}`);
      await db.insert(RoomImages).values({
        image_id: galleryImg.id,
        order: i,
        room_id: room2!.id,
      });
    }

    // All 10 amenities
    for (let i = 0; i < amenityIds.length; i++) {
      await db.insert(RoomAmenities).values({
        amenity_id: amenityIds[i]!,
        order: i,
        room_id: room2!.id,
      });
    }
    console.log("  ✅ Room 2 created with 3 images and 10 amenities\n");

    // ==================== ROOM 3: Premium Cottage ====================
    console.log("🏨 Creating Room 3: Premium Cottage...");

    const featuredImg3 = await createImage(ROOM_IMAGES.suite[0]!, "Premium Cottage");
    const [room3] = await db.insert(Rooms).values({
      base_price: "7500.00",
      bed_type: "double",
      check_in_time: "14:00",
      check_out_time: "11:00",
      children_policy: "Children above 5 years are welcome. Extra mattress available on request.",
      description:
        "Nestled among the trees, our Premium Cottage offers a secluded retreat perfect for families and couples alike. The standalone cottage features two comfortable double beds, a cozy sitting nook, and a private garden patio. Step outside to birdsong and fresh mountain air, with direct access to the resort's nature trail.",
      extra_beds: "Extra mattress available at ₹800 per night.",
      image: featuredImg3.id,
      is_featured: 0,
      max_occupancy: 4,
      number_of_beds: 2,
      order: 2,
      peak_season_price: "10000.00",
      rating: "4.6",
      review_count: 35,
      size_sqft: 450,
      slug: "premium-cottage",
      status: "available",
      title: "Premium Cottage",
      weekend_price: "8500.00",
    }).returning();

    // Gallery images
    for (let i = 0; i < ROOM_IMAGES.suite.length; i++) {
      const galleryImg = await createImage(ROOM_IMAGES.suite[i]!, `Premium Cottage - View ${i + 1}`);
      await db.insert(RoomImages).values({
        image_id: galleryImg.id,
        order: i,
        room_id: room3!.id,
      });
    }

    // 8 amenities
    for (let i = 0; i < 8; i++) {
      await db.insert(RoomAmenities).values({
        amenity_id: amenityIds[i]!,
        order: i,
        room_id: room3!.id,
      });
    }
    console.log("  ✅ Room 3 created with 3 images and 8 amenities\n");

    // ==================== SUMMARY ====================
    console.log("🎉 Seed completed successfully!");
    console.log("   Created 3 rooms:");
    console.log(`   1. Deluxe Riverside Room (id: ${room1!.id})`);
    console.log(`   2. Executive Suite (id: ${room2!.id})`);
    console.log(`   3. Premium Cottage (id: ${room3!.id})`);
    console.log(`   Created ${amenityIds.length} amenities`);
    console.log("   Created 12 images (3 featured + 9 gallery)");
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }

  process.exit(0);
}

seedRooms();
