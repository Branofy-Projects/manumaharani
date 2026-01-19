import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";

// Core Schemas
import { Amenities } from "./schema/amenities.schema";
// Auth Schema
import {
  Accounts,
  EmailVerificationTokens,
  PasswordResetTokens,
  Sessions,
  TwoFactorTokens,
  UserAuditLog,
  UserPreferences,
  userRoles,
  Users,
  Verifications,
} from "./schema/auth.schema";
// Blog Schema
import {
  blogCategoryEnum,
  BlogImages,
  Blogs,
  blogStatusEnum,
} from "./schema/blogs.schema";
// Bookings Schema
import {
  BookingPayments,
  Bookings,
  bookingStatusEnum,
  paymentStatusEnum,
} from "./schema/bookings.schema";
import { Faqs } from "./schema/faqs.schema";
// Gallery Schema
import {
  Gallery,
  galleryCategoryEnum,
  galleryTypeEnum,
} from "./schema/gallery.schema";
import { Images } from "./schema/images.schema";
import { Policies, policyKindEnum } from "./schema/policies.schema";
// Relations
import * as relations from "./schema/relations.schema";
// Room Types Schema
import {
  bedTypeEnum,
  RoomTypeAmenities,
  RoomTypeFaqs,
  RoomTypeImages,
  RoomTypePolicies,
  RoomTypes,
  roomTypeStatusEnum,
} from "./schema/room-types.schema";
// Rooms Schema
import { RoomImages, Rooms, roomStatusEnum } from "./schema/rooms.schema";
// Testimonials Schema
import {
  Testimonials,
  testimonialStatusEnum,
} from "./schema/testimonials.schema";

export type {
  TAccount,
  TNewUser,
  TSession,
  TUser,
  TUserAuditLog,
  TUserPreferences,
  TUserRole,
  TVerification,
} from "./schema/auth.schema";

// Core Types
export type {
  TAmenityBase,
  TInsertAmenity,
  TNewAmenity,
} from "./schema/amenities.schema";

export type { TFaqBase, TInsertFaq, TNewFaq } from "./schema/faqs.schema";

export type { TImage, TNewImage } from "./schema/images.schema";

/**
 * --------------------------------------- Export Drizzle Utilities ---------------------------------------
 */
export * from "drizzle-orm";

/**
 * --------------------------------------- Export Schema Tables ---------------------------------------
 */
export {
  // Auth
  Accounts,
  Amenities,
  bedTypeEnum,
  blogCategoryEnum,
  BlogImages,
  Blogs,
  blogStatusEnum,
  BookingPayments,
  Bookings,
  bookingStatusEnum,
  EmailVerificationTokens,
  Faqs,
  Gallery,
  galleryCategoryEnum,
  galleryTypeEnum,
  Images,
  PasswordResetTokens,
  paymentStatusEnum,
  Policies,
  policyKindEnum,
  RoomImages,
  Rooms,
  roomStatusEnum,
  RoomTypeAmenities,
  RoomTypeFaqs,
  RoomTypeImages,
  RoomTypePolicies,
  RoomTypes,
  roomTypeStatusEnum,
  Sessions,
  Testimonials,
  testimonialStatusEnum,
  TwoFactorTokens,
  UserAuditLog,
  UserPreferences,
  userRoles,
  Users,
  Verifications,
};

export const schemaWithoutRelations = {
  Accounts,
  Amenities,
  BlogImages,
  Blogs,
  BookingPayments,
  Bookings,
  EmailVerificationTokens,
  Faqs,
  Gallery,
  Images,
  PasswordResetTokens,
  Policies,
  RoomImages,
  Rooms,
  RoomTypeAmenities,
  RoomTypeFaqs,
  RoomTypeImages,
  RoomTypePolicies,
  RoomTypes,
  Sessions,
  Testimonials,
  TwoFactorTokens,
  UserAuditLog,
  UserPreferences,
  Users,
  Verifications,
};

export const schema = {
  ...schemaWithoutRelations,
  ...relations,
};

// Only load dotenv in Node.js runtime (not Edge Runtime)
// Edge Runtime doesn't support process.cwd(), so we check runtime first
if (
  process.env.NODE_ENV !== "production" &&
  typeof process !== "undefined"
  
) {
  try {
    config({ path: "../../.env" });
  } catch (error) {
    // Silently fail if .env file doesn't exist or in Edge Runtime
    // This is expected when running in Edge Runtime or when .env is not present
  }
}

const getDatabaseUrl = () => {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("❌ DATABASE_URL is not set in environment variables");
    console.error("Please check your .env file in the project root");
    throw new Error(
      "DATABASE_URL environment variable is required. Please set it in your .env file."
    );
  }

  // Basic URL validation
  try {
    new URL(url);
  } catch (urlError) {
    console.error("❌ DATABASE_URL is not a valid URL:", url);
    throw new Error(
      `DATABASE_URL is not a valid URL: ${urlError instanceof Error ? urlError.message : String(urlError)}`
    );
  }

  return url;
};

export const db = drizzle(getDatabaseUrl(), { schema });

// Export utilities
export * from "./utils/file-utils";
