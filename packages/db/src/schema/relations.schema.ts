import { relations } from 'drizzle-orm';

import { Amenities } from './amenities.schema';
import { AttractionBookings } from './attraction-bookings.schema';
import { AttractionImages, Attractions } from './attractions.schema';
import { Users } from './auth.schema';
import { BlogImages, Blogs } from './blogs.schema';
import { BookingPayments, Bookings } from './bookings.schema';
import { EventBookings } from './event-bookings.schema';
import { EventFaqs, EventHighlights, EventImages, EventItinerary, Events } from './events.schema';
import { Faqs } from './faqs.schema';
import { Gallery } from './gallery.schema';
import { Images } from './images.schema';
import { OfferBookings } from './offer-bookings.schema';
import { OfferFaqs, OfferHighlights, OfferImages, OfferItinerary, Offers } from './offers.schema';
import { Policies } from './policies.schema';
import { RoomBookings } from './room-bookings.schema';
import {
    RoomTypeAmenities, RoomTypeFaqs, RoomTypeImages, RoomTypePolicies, RoomTypes
} from './room-types.schema';
import { RoomAmenities, RoomImages, Rooms } from './rooms.schema';
import { Testimonials } from './testimonials.schema';


export const roomTypeRelations = relations(RoomTypes, ({ many }) => ({
  amenities: many(RoomTypeAmenities),
  bookings: many(Bookings),
  faqs: many(RoomTypeFaqs),
  images: many(RoomTypeImages),
  policies: many(RoomTypePolicies),
  rooms: many(Rooms),
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
  amenities: many(RoomAmenities),
  bookings: many(RoomBookings),
  image: one(Images, {
    fields: [Rooms.image],
    references: [Images.id],
  }),
  images: many(RoomImages),
}));

export const roomAmenitiesRelations = relations(RoomAmenities, ({ one }) => ({
  amenity: one(Amenities, {
    fields: [RoomAmenities.amenity_id],
    references: [Amenities.id],
  }),
  room: one(Rooms, {
    fields: [RoomAmenities.room_id],
    references: [Rooms.id],
  }),
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
  events: many(EventFaqs),
  offers: many(OfferFaqs),
  roomTypes: many(RoomTypeFaqs),
}));

export const eventRelations = relations(Events, ({ many, one }) => ({
  bookings: many(EventBookings),
  faqs: many(EventFaqs),
  highlights: many(EventHighlights),
  image: one(Images, {
    fields: [Events.image],
    references: [Images.id],
  }),
  images: many(EventImages),
  itinerary: many(EventItinerary),
}));

export const eventImagesRelations = relations(EventImages, ({ one }) => ({
  event: one(Events, {
    fields: [EventImages.event_id],
    references: [Events.id],
  }),
  image: one(Images, {
    fields: [EventImages.image_id],
    references: [Images.id],
  }),
}));

export const eventHighlightsRelations = relations(EventHighlights, ({ one }) => ({
  event: one(Events, {
    fields: [EventHighlights.event_id],
    references: [Events.id],
  }),
}));

export const eventItineraryRelations = relations(EventItinerary, ({ one }) => ({
  event: one(Events, {
    fields: [EventItinerary.event_id],
    references: [Events.id],
  }),
}));

export const eventFaqsRelations = relations(EventFaqs, ({ one }) => ({
  event: one(Events, {
    fields: [EventFaqs.event_id],
    references: [Events.id],
  }),
  faq: one(Faqs, {
    fields: [EventFaqs.faq_id],
    references: [Faqs.id],
  }),
}));

export const offerRelations = relations(Offers, ({ many, one }) => ({
  faqs: many(OfferFaqs),
  highlights: many(OfferHighlights),
  image: one(Images, {
    fields: [Offers.image],
    references: [Images.id],
  }),
  images: many(OfferImages),
  itinerary: many(OfferItinerary),
}));

export const offerImagesRelations = relations(OfferImages, ({ one }) => ({
  image: one(Images, {
    fields: [OfferImages.image_id],
    references: [Images.id],
  }),
  offer: one(Offers, {
    fields: [OfferImages.offer_id],
    references: [Offers.id],
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
  faq: one(Faqs, {
    fields: [OfferFaqs.faq_id],
    references: [Faqs.id],
  }),
  offer: one(Offers, {
    fields: [OfferFaqs.offer_id],
    references: [Offers.id],
  }),
}));

export const attractionRelations = relations(Attractions, ({ many, one }) => ({
  bookings: many(AttractionBookings),
  image: one(Images, {
    fields: [Attractions.image],
    references: [Images.id],
  }),
  images: many(AttractionImages),
}));

export const attractionImageRelations = relations(AttractionImages, ({ one }) => ({
  attraction: one(Attractions, {
    fields: [AttractionImages.attraction_id],
    references: [Attractions.id],
  }),
  image: one(Images, {
    fields: [AttractionImages.image_id],
    references: [Images.id],
  }),
}));

export const attractionBookingRelations = relations(AttractionBookings, ({ one }) => ({
  attraction: one(Attractions, {
    fields: [AttractionBookings.attraction_id],
    references: [Attractions.id],
  }),
}));

export const eventBookingRelations = relations(EventBookings, ({ one }) => ({
  event: one(Events, {
    fields: [EventBookings.event_id],
    references: [Events.id],
  }),
}));

export const offerBookingRelations = relations(OfferBookings, ({ one }) => ({
  offer: one(Offers, {
    fields: [OfferBookings.offer_id],
    references: [Offers.id],
  }),
}));

export const roomBookingRelations = relations(RoomBookings, ({ one }) => ({
  room: one(Rooms, {
    fields: [RoomBookings.room_id],
    references: [Rooms.id],
  }),
}));
