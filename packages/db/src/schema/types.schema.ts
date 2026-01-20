import type { TAmenityBase } from "./amenities.schema";
import type { TUser } from "./auth.schema";
import type { TBlogBase, TBlogImageBase } from "./blogs.schema";
import type { TBookingBase, TBookingPaymentBase } from "./bookings.schema";
import type { TFaqBase } from "./faqs.schema";
import type { TGalleryBase } from "./gallery.schema";
import type { TImage } from "./images.schema";
import type { TPolicyBase } from "./policies.schema";

// Simple types without relations
export type TAmenity = TAmenityBase;
export type TFaq = TFaqBase;
export type TPolicy = TPolicyBase;
import type {
  TRoomTypeAmenityBase,
  TRoomTypeBase,
  TRoomTypeFaqBase,
  TRoomTypeImageBase,
  TRoomTypePolicyBase,
} from "./room-types.schema";
import type { TRoomBase } from "./rooms.schema";
import type { TTestimonialBase } from "./testimonials.schema";

export type TBlog = {
  author: null | TUser;
  featuredImage: null | TImage;
  images: TBlogImage[];
} & TBlogBase;

// Blog Types with Relations
export type TBlogImage = {
  image: TImage;
} & TBlogImageBase;

// Booking Types with Relations
export type TBooking = {
  payments: TBookingPaymentBase[];
  room: null | TRoomBase;
  roomType: TRoomTypeBase;
  user: null | TUser;
} & TBookingBase;

export type TBookingWithDetails = {
  payments: TBookingPaymentBase[];
  room: null | TRoom;
  roomType: TRoomType;
  user: null | TUser;
} & TBookingBase;

// Gallery Types with Relations
export type TGallery = {
  image: null | TImage;
  videoThumbnail: null | TImage;
} & TGalleryBase;

// Room Types with Relations
export type TRoom = {
  roomType: TRoomType;
} & TRoomBase;

export type TRoomType = {
  amenities: TRoomTypeAmenity[];
  faqs: TRoomTypeFaq[];
  images: TRoomTypeImage[];
  policies: TRoomTypePolicy[];
} & TRoomTypeBase;

export type TRoomTypeAmenity = {
  amenity: TAmenityBase;
} & TRoomTypeAmenityBase;

export type TRoomTypeFaq = {
  faq: TFaqBase;
} & TRoomTypeFaqBase;

// Room Type Types with Relations
export type TRoomTypeImage = {
  image: TImage;
} & TRoomTypeImageBase;

export type TRoomTypePolicy = {
  policy: TPolicyBase;
} & TRoomTypePolicyBase;

// Testimonial Types with Relations
export type TTestimonial = {
  guestAvatar: null | TImage;
  user: null | TUser;
} & TTestimonialBase;
