/**
 * Seed script to populate the gallery with images from the existing website.
 * Run with: npx tsx src/seed-gallery.ts
 */

import { config } from "dotenv";
config({ path: "../../.env" });

import { db, Gallery, Images } from "./index";

type GallerySeedItem = {
  category: "dining" | "overview" | "room" | "wedding";
  title: string;
  url: string;
};

const GALLERY_DATA: GallerySeedItem[] = [
  // ─── Overview (16 images) ───
  { category: "overview", title: "Resort Exterior View", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2022/10/5-scaled.jpg" },
  { category: "overview", title: "Resort Landscape", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2022/10/DSC_9543-scaled.jpg" },
  { category: "overview", title: "Poolside View", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2022/09/DSC_9826-scaled.jpg" },
  { category: "overview", title: "Garden Area", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2022/09/DSC_9781-scaled.jpg" },
  { category: "overview", title: "Resort Grounds", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2022/09/DSC_9835-scaled.jpg" },
  { category: "overview", title: "Terrace View", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2022/09/DSC_9775-scaled.jpg" },
  { category: "overview", title: "Resort Entrance", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2022/09/DSC_9760-scaled.jpg" },
  { category: "overview", title: "Lobby Area", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2022/09/DSC_9704-scaled.jpg" },
  { category: "overview", title: "Aerial View of Resort", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2022/09/DJI_0789-scaled.jpg" },
  { category: "overview", title: "Resort from Above", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2022/09/DJI_0766-scaled.jpg" },
  { category: "overview", title: "Bird's Eye View", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2022/09/DJI_0740-scaled.jpg" },
  { category: "overview", title: "Resort Panorama", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2022/09/2-scaled.jpg" },
  { category: "overview", title: "Resort Building", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2022/09/DSC_9543-scaled.jpg" },
  { category: "overview", title: "Resort Facade", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2022/09/DSC_9552-scaled.jpg" },
  { category: "overview", title: "Evening View", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2022/09/DSC_9484-scaled.jpg" },
  { category: "overview", title: "Night View", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2022/09/DSC_9458-scaled.jpg" },

  // ─── Room (25 images) ───
  { category: "room", title: "Premium Room View", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2022/10/DAP06592.webp" },
  { category: "room", title: "Room Interior", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2022/10/DAP06593.webp" },
  { category: "room", title: "Room Decor", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2022/10/DAP06595.webp" },
  { category: "room", title: "Bedroom View", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2022/10/DAP06596.webp" },
  { category: "room", title: "Room Amenities", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2022/10/DAP06598.webp" },
  { category: "room", title: "Suite Overview", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2022/10/DAP06600.webp" },
  { category: "room", title: "Deluxe Room", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2022/10/MOK_9951.webp" },
  { category: "room", title: "Room Seating Area", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2022/10/MOK_9956.webp" },
  { category: "room", title: "Room Balcony", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2022/10/MOK_9958.webp" },
  { category: "room", title: "Superior Room", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2022/11/DAP06586.webp" },
  { category: "room", title: "Room Furnishing", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2022/11/DAP06587.webp" },
  { category: "room", title: "Room Styling", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2022/11/DAP06588.webp" },
  { category: "room", title: "Executive Room", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2022/11/MOK_9927.webp" },
  { category: "room", title: "Room Lighting", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2022/11/MOK_9929.webp" },
  { category: "room", title: "Room Window View", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2022/11/MOK_9930.webp" },
  { category: "room", title: "Room Bed", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2022/11/MOK_9934.webp" },
  { category: "room", title: "Room Details", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2022/11/MOK_9936.webp" },
  { category: "room", title: "Bathroom", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2022/11/MOK_9939.webp" },
  { category: "room", title: "Room Closet", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2022/11/MOK_9940.webp" },
  { category: "room", title: "Room Desk", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2022/11/MOK_9941.webp" },
  { category: "room", title: "Family Suite", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2022/11/MOK_0004.webp" },
  { category: "room", title: "Suite Living Area", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2022/11/MOK_0005.webp" },
  { category: "room", title: "Suite Bedroom", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2022/11/MOK_0016.webp" },
  { category: "room", title: "Suite Bathroom", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2022/11/MOK_0017.webp" },
  { category: "room", title: "Panoramic Suite", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2022/11/MOK_0024-HDR.webp" },

  // ─── Dining (11 images) ───
  { category: "dining", title: "Restaurant Interior", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2022/04/MOK_9966.webp" },
  { category: "dining", title: "Dining Setup", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2022/04/MOK_9974.webp" },
  { category: "dining", title: "Table Setting", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2022/04/MOK_9975.webp" },
  { category: "dining", title: "Buffet Area", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2022/04/MOK_9976.webp" },
  { category: "dining", title: "Restaurant Ambiance", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2022/04/MOK_9977.webp" },
  { category: "dining", title: "Dining Hall", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2022/04/MOK_9988.webp" },
  { category: "dining", title: "Fine Dining", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2022/04/MOK_9989.webp" },
  { category: "dining", title: "Bar Area", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2022/04/MOK_9993.webp" },
  { category: "dining", title: "Lounge Seating", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2022/04/MOK_9995.webp" },
  { category: "dining", title: "Restaurant Decor", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2022/04/MOK_9996.webp" },
  { category: "dining", title: "Outdoor Dining", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2022/04/MOK_9997.webp" },

  // ─── Wedding (57 images) ───
  { category: "wedding", title: "Wedding Decor", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2022/09/pic6.jpg" },
  { category: "wedding", title: "Wedding Celebration", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2022/09/IMG_20190303_210336.jpg" },
  { category: "wedding", title: "Wedding Venue", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2022/09/DSC_9908-scaled.jpg" },
  { category: "wedding", title: "Wedding Setup", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2022/09/DSC_9854-scaled.jpg" },
  { category: "wedding", title: "Ceremony Area", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2022/09/DSC_9860-scaled.jpg" },
  { category: "wedding", title: "Banquet Hall", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2022/09/DSC_9658-scaled.jpg" },
  { category: "wedding", title: "Event Space", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2022/09/DSC_9653-scaled.jpg" },
  { category: "wedding", title: "Reception Area", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2022/09/DSC_9652-scaled.jpg" },
  { category: "wedding", title: "Ballroom", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2022/09/DSC_9695-scaled.jpg" },
  { category: "wedding", title: "Wedding Floral Decor", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2024/05/DSC02600.webp" },
  { category: "wedding", title: "Mandap Setup", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2024/05/DSC02605.webp" },
  { category: "wedding", title: "Mandap Details", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2024/05/DSC02608.webp" },
  { category: "wedding", title: "Mandap Closeup", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2024/05/DSC02609.webp" },
  { category: "wedding", title: "Ceremony Decor", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2024/05/DSC02611.webp" },
  { category: "wedding", title: "Wedding Flowers", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2024/05/DSC02618.webp" },
  { category: "wedding", title: "Floral Arrangement", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2024/05/DSC02620.webp" },
  { category: "wedding", title: "Wedding Stage", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2024/05/DSC02647.webp" },
  { category: "wedding", title: "Stage Decor", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2024/05/DSC02806.webp" },
  { category: "wedding", title: "Stage Lighting", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2024/05/DSC02809.webp" },
  { category: "wedding", title: "Stage Setup", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2024/05/DSC02811.webp" },
  { category: "wedding", title: "Outdoor Wedding Setup", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2024/05/DSC03789.webp" },
  { category: "wedding", title: "Garden Wedding", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2024/05/DSC03825.webp" },
  { category: "wedding", title: "Wedding Pathway", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2024/05/DSC03826.webp" },
  { category: "wedding", title: "Entrance Decor", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2024/05/DSC03830.webp" },
  { category: "wedding", title: "Welcome Gate", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2024/05/DSC03832.webp" },
  { category: "wedding", title: "Gate Flowers", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2024/05/DSC03836.webp" },
  { category: "wedding", title: "Wedding Arch", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2024/05/DSC03839.webp" },
  { category: "wedding", title: "Night Decor", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2024/05/DSC03845.webp" },
  { category: "wedding", title: "Evening Lighting", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2024/05/DSC03848.webp" },
  { category: "wedding", title: "Fairy Lights", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2024/05/DSC03856.webp" },
  { category: "wedding", title: "Ceiling Decor", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2024/05/DSC03863.webp" },
  { category: "wedding", title: "Draped Ceiling", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2024/05/DSC03866.webp" },
  { category: "wedding", title: "Table Decor", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2024/05/DSC03884.webp" },
  { category: "wedding", title: "Centerpiece", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2024/05/DSC03887.webp" },
  { category: "wedding", title: "Table Setting", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2024/05/DSC03891.webp" },
  { category: "wedding", title: "Wedding Dining", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2024/05/DSC03903.webp" },
  { category: "wedding", title: "Buffet Setup", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2024/05/DSC03916.webp" },
  { category: "wedding", title: "Food Display", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2024/05/DSC03918.webp" },
  { category: "wedding", title: "Dessert Station", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2024/05/DSC03927.webp" },
  { category: "wedding", title: "Wedding Catering", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2024/05/DSC03930.webp" },
  { category: "wedding", title: "Sangeet Decor", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2024/05/DSC03938.webp" },
  { category: "wedding", title: "Sangeet Stage", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2024/05/DSC03940.webp" },
  { category: "wedding", title: "Dance Floor", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2024/05/DSC03947.webp" },
  { category: "wedding", title: "Sangeet Lighting", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2024/05/DSC03964.webp" },
  { category: "wedding", title: "Haldi Ceremony Setup", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2024/05/DSC03975.webp" },
  { category: "wedding", title: "Haldi Decor", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2024/05/DSC03977.webp" },
  { category: "wedding", title: "Mehndi Setup", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2024/05/DSC03982.webp" },
  { category: "wedding", title: "Mehndi Decor", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2024/05/DSC03989.webp" },
  { category: "wedding", title: "Mehndi Area", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2024/05/DSC03991.webp" },
  { category: "wedding", title: "Poolside Event", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2024/05/DSC03995.webp" },
  { category: "wedding", title: "Pool Decor", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2024/05/DSC03996.webp" },
  { category: "wedding", title: "Floating Candles", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2024/05/DSC03997.webp" },
  { category: "wedding", title: "Reception Decor", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2024/05/DSC04000.webp" },
  { category: "wedding", title: "Vidaai Setup", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2024/05/DSC04019.webp" },
  { category: "wedding", title: "Farewell Decor", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2024/05/DSC04021.webp" },
  { category: "wedding", title: "Baraat Entrance", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2024/05/DSC04264.webp" },
  { category: "wedding", title: "Baraat Welcome", url: "https://www.manumaharaniresorts.com/wp-content/uploads/2024/05/DSC04274.webp" },
];

async function seedGallery() {
  console.log("Starting gallery seed...");
  console.log(`Total items to seed: ${GALLERY_DATA.length}`);

  try {
    // Clear existing gallery data
    console.log("\nClearing existing gallery data...");
    await db.delete(Gallery);
    console.log("Existing gallery data cleared.");

    let imageCount = 0;
    let galleryCount = 0;

    for (const item of GALLERY_DATA) {
      // Insert image record
      const [image] = await db
        .insert(Images)
        .values({
          alt_text: item.title,
          large_url: item.url,
          medium_url: item.url,
          original_url: item.url,
          small_url: item.url,
        })
        .returning();

      imageCount++;

      // Insert gallery record
      await db.insert(Gallery).values({
        category: item.category,
        image_id: image.id,
        order: galleryCount,
        title: item.title,
        type: "image",
      });

      galleryCount++;

      if (galleryCount % 10 === 0) {
        console.log(`  Seeded ${galleryCount}/${GALLERY_DATA.length} items...`);
      }
    }

    // Summary
    const overviewCount = GALLERY_DATA.filter((i) => i.category === "overview").length;
    const roomCount = GALLERY_DATA.filter((i) => i.category === "room").length;
    const diningCount = GALLERY_DATA.filter((i) => i.category === "dining").length;
    const weddingCount = GALLERY_DATA.filter((i) => i.category === "wedding").length;

    console.log("\nSeed completed successfully!");
    console.log(`  Images created: ${imageCount}`);
    console.log(`  Gallery items created: ${galleryCount}`);
    console.log(`\n  Breakdown by category:`);
    console.log(`    Overview: ${overviewCount}`);
    console.log(`    Room:     ${roomCount}`);
    console.log(`    Dining:   ${diningCount}`);
    console.log(`    Wedding:  ${weddingCount}`);
  } catch (error) {
    console.error("Error seeding gallery:", error);
    throw error;
  }

  process.exit(0);
}

seedGallery();
