import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";

// Core Schemas
import { Amenities } from "./schema/amenities.schema";
import { Attractions } from "./schema/attractions.schema";
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
import { Events } from "./schema/events.schema";
import { Faqs } from "./schema/faqs.schema";
// Gallery Schema
import {
  Gallery,
  galleryCategoryEnum,
  galleryTypeEnum,
} from "./schema/gallery.schema";
import { Images } from "./schema/images.schema";
import {
  highlightTypeEnum,
  offerCategoryEnum,
  OfferFaqs,
  OfferHighlights,
  OfferImages,
  OfferItinerary,
  Offers,
  offerStatusEnum,
} from "./schema/offers.schema";
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
import {
  RoomAmenities,
  RoomImages,
  Rooms,
  roomStatusEnum,
} from "./schema/rooms.schema";
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
export type {
  TAttractionBase,
  TNewAttraction,
} from "./schema/attractions.schema";

export type {
  TInsertPolicy,
  TNewPolicy,
  TPolicyBase,
} from "./schema/policies.schema";

export type { TFaqBase, TInsertFaq, TNewFaq } from "./schema/faqs.schema";

export type { TImage, TNewImage } from "./schema/images.schema";

export type { TNewGallery } from "./schema/gallery.schema";

export type {
  TNewRoomType,
} from "./schema/room-types.schema";

export type {
  TNewRoom,
} from "./schema/rooms.schema";

export type {
  TNewTestimonial,
} from "./schema/testimonials.schema";

// Blog and Related Types
export type {
  TAmenity,
  TAttraction,
  TBlog,
  TBlogImage,
  TBooking,
  TBookingWithDetails,
  TFaq,
  TGallery,
  TOffer,
  TOfferFaq,
  TOfferHighlight,
  TOfferImage,
  TOfferItinerary,
  TOfferWithDetails,
  TPolicy,
  TRoom,
  TRoomAmenity,
  TRoomImage,
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
  Amenities,
  Attractions,
  bedTypeEnum,
  blogCategoryEnum,
  BlogImages,
  Blogs,
  blogStatusEnum,
  BookingPayments,
  Bookings,
  bookingStatusEnum,
  EmailVerificationTokens,
  Events,
  Faqs,
  Gallery,
  galleryCategoryEnum,
  galleryTypeEnum,
  highlightTypeEnum,
  Images,
  offerCategoryEnum,
  OfferFaqs,
  OfferHighlights,
  OfferImages,
  OfferItinerary,
  Offers,
  offerStatusEnum,
  PasswordResetTokens,
  paymentStatusEnum,
  Policies,
  policyKindEnum,
  RoomAmenities,
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
  Attractions,
  BlogImages,
  Blogs,
  BookingPayments,
  Bookings,
  EmailVerificationTokens,
  Events,
  Faqs,
  Gallery,
  Images,
  OfferFaqs,
  OfferHighlights,
  OfferImages,
  OfferItinerary,
  Offers,
  PasswordResetTokens,
  Policies,
  RoomAmenities,
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

// Lazy initialization of database connection
type DrizzleDB = ReturnType<typeof drizzle<typeof schema>>;

let _db: DrizzleDB | null = null;

const getDb = (): DrizzleDB => {
  if (!_db) {
    _db = drizzle(getDatabaseUrl(), { schema });
  }
  return _db;
};

// Export db as a proxy that lazily initializes the connection
export const db = new Proxy({} as DrizzleDB, {
  get(_target, prop) {
    return getDb()[prop as keyof DrizzleDB];
  },
});

// Export utilities
export * from "./utils/file-utils";
