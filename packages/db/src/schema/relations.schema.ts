import { relations } from 'drizzle-orm';

import { Amenities } from './amenities.schema';
import { Users } from './auth.schema';
import { BlogImages, Blogs } from './blogs.schema';
import { BookingPayments, Bookings } from './bookings.schema';
import { Faqs } from './faqs.schema';
import { Gallery } from './gallery.schema';
import { Images } from './images.schema';
import { Policies } from './policies.schema';
import {
    RoomTypeAmenities, RoomTypeFaqs, RoomTypeImages, RoomTypePolicies, RoomTypes
} from './room-types.schema';
import { RoomAmenities, RoomImages, Rooms } from './rooms.schema';
import { Testimonials } from './testimonials.schema';
import { Events } from './events.schema';
import { OfferFaqs, OfferHighlights, OfferImages, OfferItinerary, Offers } from './offers.schema';
import { Attractions } from './attractions.schema';


export const roomTypeRelations = relations(RoomTypes, ({ many }) => ({
  amenities: many(RoomTypeAmenities),
  faqs: many(RoomTypeFaqs),
  images: many(RoomTypeImages),
  policies: many(RoomTypePolicies),
}));

export const roomTypeImagesRelations = relations(RoomTypeImages, ({ one }) => ({
  image: one(Images, {
    fields: [RoomTypeImages.image_id],
    references: [Images.id],
  }),
  roomType: one(RoomTypes, {
    fields: [RoomTypeImages.room_type_id],
    references: [RoomTypes.id],
  }),
}));

export const roomTypeAmenitiesRelations = relations(
  RoomTypeAmenities,
  ({ one }) => ({
    amenity: one(Amenities, {
      fields: [RoomTypeAmenities.amenity_id],
      references: [Amenities.id],
    }),
    roomType: one(RoomTypes, {
      fields: [RoomTypeAmenities.room_type_id],
      references: [RoomTypes.id],
    }),
  })
);

export const roomTypePoliciesRelations = relations(
  RoomTypePolicies,
  ({ one }) => ({
    policy: one(Policies, {
      fields: [RoomTypePolicies.policy_id],
      references: [Policies.id],
    }),
    roomType: one(RoomTypes, {
      fields: [RoomTypePolicies.room_type_id],
      references: [RoomTypes.id],
    }),
  })
);

export const roomTypeFaqsRelations = relations(RoomTypeFaqs, ({ one }) => ({
  faq: one(Faqs, {
    fields: [RoomTypeFaqs.faq_id],
    references: [Faqs.id],
  }),
  roomType: one(RoomTypes, {
    fields: [RoomTypeFaqs.room_type_id],
    references: [RoomTypes.id],
  }),
}));

export const roomRelations = relations(Rooms, ({ many, one }) => ({
  image: one(Images, {
    fields: [Rooms.image],
    references: [Images.id],
  }),
  images: many(RoomImages),
  amenities: many(RoomAmenities),
}));

export const roomImagesRelations = relations(RoomImages, ({ one }) => ({
  image: one(Images, {
    fields: [RoomImages.image_id],
    references: [Images.id],
  }),
  room: one(Rooms, {
    fields: [RoomImages.room_id],
    references: [Rooms.id],
  }),
}));

export const roomAmenitiesRelations = relations(RoomAmenities, ({ one }) => ({
  room: one(Rooms, {
    fields: [RoomAmenities.room_id],
    references: [Rooms.id],
  }),
  amenity: one(Amenities, {
    fields: [RoomAmenities.amenity_id],
    references: [Amenities.id],
  }),
}));

export const bookingRelations = relations(Bookings, ({ many, one }) => ({
  payments: many(BookingPayments),
  room: one(Rooms, {
    fields: [Bookings.room_id],
    references: [Rooms.id],
  }),
  roomType: one(RoomTypes, {
    fields: [Bookings.room_type_id],
    references: [RoomTypes.id],
  }),
  user: one(Users, {
    fields: [Bookings.user_id],
    references: [Users.id],
  }),
}));

export const bookingPaymentsRelations = relations(
  BookingPayments,
  ({ one }) => ({
    booking: one(Bookings, {
      fields: [BookingPayments.booking_id],
      references: [Bookings.id],
    }),
  })
);

export const blogRelations = relations(Blogs, ({ many, one }) => ({
  author: one(Users, {
    fields: [Blogs.author_id],
    references: [Users.id],
  }),
  featuredImage: one(Images, {
    fields: [Blogs.featured_image_id],
    references: [Images.id],
  }),
  images: many(BlogImages),
}));

export const blogImagesRelations = relations(BlogImages, ({ one }) => ({
  blog: one(Blogs, {
    fields: [BlogImages.blog_id],
    references: [Blogs.id],
  }),
  image: one(Images, {
    fields: [BlogImages.image_id],
    references: [Images.id],
  }),
}));

export const galleryRelations = relations(Gallery, ({ one }) => ({
  image: one(Images, {
    fields: [Gallery.image_id],
    references: [Images.id],
  }),
  videoThumbnail: one(Images, {
    fields: [Gallery.video_thumbnail_id],
    references: [Images.id],
  }),
}));

export const testimonialRelations = relations(Testimonials, ({ one }) => ({
  guestAvatar: one(Images, {
    fields: [Testimonials.guest_avatar_id],
    references: [Images.id],
  }),
  user: one(Users, {
    fields: [Testimonials.user_id],
    references: [Users.id],
  }),
}));

export const amenityRelations = relations(Amenities, ({ many }) => ({
  roomTypes: many(RoomTypeAmenities),
}));

export const policyRelations = relations(Policies, ({ many }) => ({
  roomTypes: many(RoomTypePolicies),
}));

export const faqRelations = relations(Faqs, ({ many }) => ({
  roomTypes: many(RoomTypeFaqs),
}));

export const eventRelations = relations(Events, ({ one }) => ({
  image: one(Images, {
    fields: [Events.image],
    references: [Images.id],
  }),
}));

export const offerRelations = relations(Offers, ({ one, many }) => ({
  image: one(Images, {
    fields: [Offers.image],
    references: [Images.id],
  }),
  images: many(OfferImages),
  highlights: many(OfferHighlights),
  itinerary: many(OfferItinerary),
  faqs: many(OfferFaqs),
}));

export const offerImagesRelations = relations(OfferImages, ({ one }) => ({
  offer: one(Offers, {
    fields: [OfferImages.offer_id],
    references: [Offers.id],
  }),
  image: one(Images, {
    fields: [OfferImages.image_id],
    references: [Images.id],
  }),
}));

export const offerHighlightsRelations = relations(OfferHighlights, ({ one }) => ({
  offer: one(Offers, {
    fields: [OfferHighlights.offer_id],
    references: [Offers.id],
  }),
}));

export const offerItineraryRelations = relations(OfferItinerary, ({ one }) => ({
  offer: one(Offers, {
    fields: [OfferItinerary.offer_id],
    references: [Offers.id],
  }),
}));

export const offerFaqsRelations = relations(OfferFaqs, ({ one }) => ({
  offer: one(Offers, {
    fields: [OfferFaqs.offer_id],
    references: [Offers.id],
  }),
  faq: one(Faqs, {
    fields: [OfferFaqs.faq_id],
    references: [Faqs.id],
  }),
}));

export const attractionRelations = relations(Attractions, ({ one }) => ({
  image: one(Images, {
    fields: [Attractions.image],
    references: [Images.id],
  }),
}));
