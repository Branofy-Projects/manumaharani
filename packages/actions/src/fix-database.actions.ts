"use server";
import { db } from "@repo/db";
import { sql } from "drizzle-orm";

/**
 * FIXES THE DATABASE SCHEMA
 * Run this once to remove resort_id constraints
 */
export async function fixDatabaseSchema() {
  try {
    if (!db) {
      throw new Error("Database connection not available");
    }

    // Drop foreign key constraints
    await db.execute(sql`ALTER TABLE "room_types" DROP CONSTRAINT IF EXISTS "room_types_resort_id_resort_id_fk"`);
    await db.execute(sql`ALTER TABLE "rooms" DROP CONSTRAINT IF EXISTS "rooms_resort_id_resort_id_fk"`);
    await db.execute(sql`ALTER TABLE "gallery" DROP CONSTRAINT IF EXISTS "gallery_resort_id_resort_id_fk"`);
    await db.execute(sql`ALTER TABLE "testimonials" DROP CONSTRAINT IF EXISTS "testimonials_resort_id_resort_id_fk"`);

    // Make columns nullable
    await db.execute(sql`ALTER TABLE "room_types" ALTER COLUMN "resort_id" DROP NOT NULL`);
    await db.execute(sql`ALTER TABLE "rooms" ALTER COLUMN "resort_id" DROP NOT NULL`);
    await db.execute(sql`ALTER TABLE "gallery" ALTER COLUMN "resort_id" DROP NOT NULL`);
    await db.execute(sql`ALTER TABLE "testimonials" ALTER COLUMN "resort_id" DROP NOT NULL`);

    return { message: "Database schema fixed successfully!", success: true };
  } catch (error: any) {
    console.error("Error fixing database:", error);
    throw new Error(`Failed to fix database: ${error?.message || String(error)}`);
  }
}

