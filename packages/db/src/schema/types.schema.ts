import type { TAmenityBase } from "./amenities.schema";
import type { TUser } from "./auth.schema";
import type { TBlogBase, TBlogImageBase } from "./blogs.schema";
import type { TBookingBase, TBookingPaymentBase } from "./bookings.schema";
import type { TFaqBase } from "./faqs.schema";
import type { TGalleryBase } from "./gallery.schema";
import type { TImage } from "./images.schema";
import type { TPolicyBase } from "./policies.schema";
import type {
  TRoomTypeAmenityBase,
  TRoomTypeBase,
  TRoomTypeFaqBase,
  TRoomTypeImageBase,
  TRoomTypePolicyBase,
} from "./room-types.schema";
import type { TRoomBase } from "./rooms.schema";
import type { TTestimonialBase } from "./testimonials.schema";

// Room Type Types with Relations
export type TRoomTypeImage = TRoomTypeImageBase & {
  image: TImage;
};

export type TRoomTypeAmenity = TRoomTypeAmenityBase & {
  amenity: TAmenityBase;
};

export type TRoomTypePolicy = TRoomTypePolicyBase & {
  policy: TPolicyBase;
};

export type TRoomTypeFaq = TRoomTypeFaqBase & {
  faq: TFaqBase;
};

export type TRoomType = TRoomTypeBase & {
  images: TRoomTypeImage[];
  amenities: TRoomTypeAmenity[];
  policies: TRoomTypePolicy[];
  faqs: TRoomTypeFaq[];
};

// Room Types with Relations
export type TRoom = TRoomBase & {
  roomType: TRoomType;
};

// Booking Types with Relations
export type TBooking = TBookingBase & {
  roomType: TRoomTypeBase;
  room: TRoomBase | null;
  user: TUser | null;
  payments: TBookingPaymentBase[];
};

export type TBookingWithDetails = TBookingBase & {
  roomType: TRoomType;
  room: TRoom | null;
  user: TUser | null;
  payments: TBookingPaymentBase[];
};

// Blog Types with Relations
export type TBlogImage = TBlogImageBase & {
  image: TImage;
};

export type TBlog = TBlogBase & {
  author: TUser | null;
  featuredImage: TImage | null;
  images: TBlogImage[];
};

// Gallery Types with Relations
export type TGallery = TGalleryBase & {
  image: TImage | null;
  videoThumbnail: TImage | null;
};

// Testimonial Types with Relations
export type TTestimonial = TTestimonialBase & {
  user: TUser | null;
  guestAvatar: TImage | null;
};

