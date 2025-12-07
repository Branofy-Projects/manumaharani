import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";

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

// Core Schemas
import { Amenities } from "./schema/amenities.schema";
import { Faqs } from "./schema/faqs.schema";
import { Images } from "./schema/images.schema";
import { policyKindEnum, Policies } from "./schema/policies.schema";

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
import { Rooms, RoomImages, roomStatusEnum } from "./schema/rooms.schema";

// Bookings Schema
import {
  BookingPayments,
  Bookings,
  bookingStatusEnum,
  paymentStatusEnum,
} from "./schema/bookings.schema";

// Blog Schema
import {
  BlogImages,
  Blogs,
  blogCategoryEnum,
  blogStatusEnum,
} from "./schema/blogs.schema";

// Gallery Schema
import {
  Gallery,
  galleryCategoryEnum,
  galleryTypeEnum,
} from "./schema/gallery.schema";

// Testimonials Schema
import {
  Testimonials,
  testimonialStatusEnum,
} from "./schema/testimonials.schema";

// Relations
import * as relations from "./schema/relations.schema";

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

export type {
  TInsertPolicy,
  TNewPolicy,
  TPolicyBase,
  TPolicyKind,
  TBedType,
  TNewRoomType,
  TNewRoomTypeAmenity,
  TNewRoomTypeFaq,
  TNewRoomTypeImage,
  TNewRoomTypePolicy,
  TRoomTypeAmenityBase,
  TRoomTypeBase,
  TRoomTypeFaqBase,
  TRoomTypeImageBase,
  TRoomTypePolicyBase,
  TRoomTypeStatus,
  TNewRoom,
  TRoomBase,
  TRoomStatus,
  TBookingBase,
  TBookingPaymentBase,
  TBookingStatus,
  TNewBooking,
  TNewBookingPayment,
  TPaymentStatus,
  TBlogBase,
  TBlogCategory,
  TBlogImageBase,
  TBlogStatus,
  TNewBlog,
  TNewBlogImage,
  TGalleryBase,
  TGalleryCategory,
  TGalleryType,
  TNewGallery,
  TNewTestimonial,
  TTestimonialBase,
  TTestimonialStatus,
  TBlog,
  TBlogImage,
  TBooking,
  TBookingWithDetails,
  TGallery,
  TRoom,
  TRoomType,
  TRoomTypeAmenity,
  TRoomTypeFaq,
  TRoomTypeImage,
  TRoomTypePolicy,
  TTestimonial,
} from "./schema/types.schema";

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
  EmailVerificationTokens,
  PasswordResetTokens,
  Sessions,
  TwoFactorTokens,
  UserAuditLog,
  UserPreferences,
  userRoles,
  Users,
  Verifications,
  Amenities,
  Faqs,
  Images,
  Policies,
  policyKindEnum,
  bedTypeEnum,
  RoomTypeAmenities,
  RoomTypeFaqs,
  RoomTypeImages,
  RoomTypePolicies,
  RoomTypes,
  roomTypeStatusEnum,
  Rooms,
  RoomImages,
  roomStatusEnum,
  BookingPayments,
  Bookings,
  bookingStatusEnum,
  paymentStatusEnum,
  BlogImages,
  Blogs,
  blogCategoryEnum,
  blogStatusEnum,
  Gallery,
  galleryCategoryEnum,
  galleryTypeEnum,
  Testimonials,
  testimonialStatusEnum,
};

export const schemaWithoutRelations = {
  Users,
  Sessions,
  Accounts,
  Verifications,
  PasswordResetTokens,
  EmailVerificationTokens,
  TwoFactorTokens,
  UserPreferences,
  UserAuditLog,
  Images,
  Amenities,
  Policies,
  Faqs,
  RoomTypes,
  RoomTypeImages,
  RoomTypeAmenities,
  RoomTypePolicies,
  RoomTypeFaqs,
  Rooms,
  RoomImages,
  Bookings,
  BookingPayments,
  Blogs,
  BlogImages,
  Gallery,
  Testimonials,
};

export const schema = {
  ...schemaWithoutRelations,
  ...relations,
};

// Only load dotenv in Node.js runtime (not Edge Runtime)
// Edge Runtime doesn't support process.cwd(), so we check runtime first
if (
  process.env.NODE_ENV !== "production" &&
  typeof process !== "undefined" &&
  process.cwd &&
  typeof process.cwd === "function" &&
  !process.env.NEXT_RUNTIME // Edge Runtime sets this
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
