'use server';

import { and, asc, count, eq, ilike } from '@repo/db';
import {
 db,
 OfferFaqs,
 OfferHighlights,
 OfferImages,
 OfferItinerary,
 Offers,
} from '@repo/db';
import { revalidatePath } from 'next/cache';

import { revalidateTags } from './client.actions';
import {
 getOfferBySlugKey,
 LATEST_OFFERS_CACHE_KEY,
 OFFERS_CACHE_KEY,
 RELATED_OFFERS_CACHE_KEY,
} from './libs/cache';
import { safeDbQuery } from './utils/db-error-handler';

import type {
 TNewOffer,
 TNewOfferHighlight,
 TNewOfferItinerary,
 TOfferCategory,
 TOfferStatus,
} from '@repo/db/schema/offers.schema';
import type { TOffer, TOfferWithDetails } from '@repo/db/schema/types.schema';

type TGetOffersFilters = {
 category?: TOfferCategory;
 limit?: number;
 page?: number;
 search?: string;
 status?: 'active' | 'inactive' | TOfferStatus;
};

export const getOffersOnly = async (filters: TGetOffersFilters = {}) => {
 const conditions = [];

 if (filters.search) {
  conditions.push(ilike(Offers.name, `%${filters.search}%`));
 }

 if (filters.status) {
  // Support both boolean active status and enum status
  if (filters.status === 'active' || filters.status === 'inactive') {
   conditions.push(eq(Offers.active, filters.status === 'active'));
  } else {
   conditions.push(eq(Offers.status, filters.status));
  }
 }

 if (filters.category) {
  conditions.push(eq(Offers.category, filters.category));
 }

 const where = conditions.length > 0 ? and(...conditions) : undefined;

 const page = Math.max(1, filters.page || 1);
 const limit = Math.max(1, filters.limit || 10);
 const offset = (page - 1) * limit;

 return db.query.Offers.findMany({
  limit,
  offset,
  orderBy: (offers, { desc }) => [desc(offers.created_at)],
  where,
  with: {
   image: true,
  },
 });
};
export const getOffers = async (filters: TGetOffersFilters = {}) => {
 const conditions = [];

 if (filters.search) {
  conditions.push(ilike(Offers.name, `%${filters.search}%`));
 }

 if (filters.status) {
  // Support both boolean active status and enum status
  if (filters.status === 'active' || filters.status === 'inactive') {
   conditions.push(eq(Offers.active, filters.status === 'active'));
  } else {
   conditions.push(eq(Offers.status, filters.status));
  }
 }

 if (filters.category) {
  conditions.push(eq(Offers.category, filters.category));
 }

 const where = conditions.length > 0 ? and(...conditions) : undefined;

 const totalResult = await safeDbQuery(
  async () => {
   const result = await db.select({ count: count() }).from(Offers).where(where);
   return result[0]?.count ?? 0;
  },
  0,
  'offers',
  'count query'
 );

 const total = typeof totalResult === 'number' ? totalResult : 0;

 const page = Math.max(1, filters.page || 1);
 const limit = Math.max(1, filters.limit || 10);
 const offset = (page - 1) * limit;

 const offers = await safeDbQuery(
  async () => {
   return db.query.Offers.findMany({
    limit,
    offset,
    orderBy: (offers, { desc }) => [desc(offers.created_at)],
    where,
    with: {
     image: true,
    },
   });
  },
  [],
  'offers',
  'findMany query'
 );

 return {
  offers: (offers || []) as unknown as TOffer[],
  total,
 };
};

export const getAllOffersSlugs = async (filters: TGetOffersFilters = {}) => {
 const conditions = [];

 if (filters.search) {
  conditions.push(ilike(Offers.name, `%${filters.search}%`));
 }

 if (filters.status) {
  // Support both boolean active status and enum status
  if (filters.status === 'active' || filters.status === 'inactive') {
   conditions.push(eq(Offers.active, filters.status === 'active'));
  } else {
   conditions.push(eq(Offers.status, filters.status));
  }
 }

 if (filters.category) {
  conditions.push(eq(Offers.category, filters.category));
 }

 const where = conditions.length > 0 ? and(...conditions) : undefined;

 return db.query.Offers.findMany({
  columns: {created_at: true, slug: true, updated_at: true},
  orderBy: (offers, { desc }) => [desc(offers.created_at)],
  where,
 });
};

export const getOfferById = async (id: string): Promise<TOffer | undefined> => {
 return db.query.Offers.findFirst({
  where: eq(Offers.id, id),
  with: {
   image: true,
  },
 }) as Promise<TOffer | undefined>;
};

export const getOfferByIdWithDetails = async (
 id: string
): Promise<null | TOfferWithDetails> => {
 const result = await safeDbQuery(
  async () => {
   return await db.query.Offers.findFirst({
    where: eq(Offers.id, id),
    with: {
     faqs: {
      orderBy: (faqs) => [asc(faqs.order)],
      with: {
       faq: true,
      },
     },
     highlights: {
      orderBy: (highlights) => [asc(highlights.order)],
     },
     image: true,
     images: {
      orderBy: (images) => [asc(images.order)],
      with: {
       image: true,
      },
     },
     itinerary: {
      orderBy: (itinerary) => [asc(itinerary.order)],
     },
    },
   });
  },
  null,
  'offers',
  'findByIdWithDetails query'
 );

 return result as null | TOfferWithDetails;
};

export const getOfferBySlug = async (
 slug: string
): Promise<null | TOfferWithDetails> => {
 const result = await safeDbQuery(
  async () => {
   return await db.query.Offers.findFirst({
    where: eq(Offers.slug, slug),
    with: {
     faqs: {
      orderBy: (faqs) => [asc(faqs.order)],
      with: {
       faq: true,
      },
     },
     highlights: {
      orderBy: (highlights) => [asc(highlights.order)],
     },
     image: true,
     images: {
      orderBy: (images) => [asc(images.order)],
      with: {
       image: true,
      },
     },
     itinerary: {
      orderBy: (itinerary) => [asc(itinerary.order)],
     },
    },
   });
  },
  null,
  'offers',
  'findBySlug query'
 );

 return result as null | TOfferWithDetails;
};

export const getRelatedOffers = async (
 currentOfferId: string,
 category?: TOfferCategory,
 limit = 4
): Promise<TOffer[]> => {
 const conditions = [eq(Offers.active, true)];

 // Exclude current offer
 // Note: We filter by active status and optionally category

 if (category) {
  conditions.push(eq(Offers.category, category));
 }

 const result = await safeDbQuery(
  async () => {
   const offers = await db.query.Offers.findMany({
    limit: limit + 1, // Fetch one extra to account for current offer
    orderBy: (offers, { desc }) => [desc(offers.created_at)],
    where: and(...conditions),
    with: {
     image: true,
    },
   });
   // Filter out the current offer
   return offers.filter((offer) => offer.id !== currentOfferId).slice(0, limit);
  },
  [],
  'offers',
  'getRelatedOffers query'
 );

 return result as TOffer[];
};

export const createOffer = async (data: TNewOffer) => {
 const [offer] = await db.insert(Offers).values(data).returning();
 revalidatePath('/offers');
 revalidateTags([
  OFFERS_CACHE_KEY,
  getOfferBySlugKey(offer.slug),
  LATEST_OFFERS_CACHE_KEY,
  RELATED_OFFERS_CACHE_KEY,
 ]);
 return offer;
};

export const updateOffer = async (id: string, data: Partial<TNewOffer>) => {
 const [updated] = await db
  .update(Offers)
  .set(data)
  .where(eq(Offers.id, id))
  .returning();
 revalidatePath('/offers');
 revalidatePath(`/offers/${updated?.slug}`);
 revalidateTags([
  OFFERS_CACHE_KEY,
  getOfferBySlugKey(updated.slug),
  LATEST_OFFERS_CACHE_KEY,
  RELATED_OFFERS_CACHE_KEY,
 ]);
 return updated;
};

export const deleteOffer = async (id: string) => {
 await db.delete(Offers).where(eq(Offers.id, id));
 revalidateTags([OFFERS_CACHE_KEY, LATEST_OFFERS_CACHE_KEY, RELATED_OFFERS_CACHE_KEY]);
 revalidatePath('/offers');
};

// ==================== Highlights ====================

export const syncOfferHighlights = async (
 offerId: string,
 highlights: Array<Omit<TNewOfferHighlight, 'offer_id'>>
) => {
 const offer = await getOfferById(offerId);
 if (!offer) {
  throw new Error('Offer not found');
 }
 // Delete existing highlights
 await db.delete(OfferHighlights).where(eq(OfferHighlights.offer_id, offerId));

 // Insert new highlights
 if (highlights.length > 0) {
  await db.insert(OfferHighlights).values(
   highlights.map((h, index) => ({
    ...h,
    offer_id: offerId,
    order: h.order ?? index,
   }))
  );
 }

 revalidatePath('/offers');
 revalidatePath(`/offers/${offerId}`);
 revalidateTags([
  OFFERS_CACHE_KEY,
  getOfferBySlugKey(offer.slug),
  LATEST_OFFERS_CACHE_KEY,
  RELATED_OFFERS_CACHE_KEY,
 ]);
};

// ==================== Itinerary ====================

export const syncOfferItinerary = async (
 offerId: string,
 itinerary: Array<Omit<TNewOfferItinerary, 'offer_id'>>
) => {
 const offer = await getOfferById(offerId);
 if (!offer) {
  throw new Error('Offer not found');
 }
 // Delete existing itinerary items
 await db.delete(OfferItinerary).where(eq(OfferItinerary.offer_id, offerId));

 // Insert new itinerary items
 if (itinerary.length > 0) {
  await db.insert(OfferItinerary).values(
   itinerary.map((item, index) => ({
    ...item,
    offer_id: offerId,
    order: item.order ?? index,
   }))
  );
 }

 revalidatePath('/offers');
 revalidatePath(`/offers/${offerId}`);
 revalidateTags([
  OFFERS_CACHE_KEY,
  getOfferBySlugKey(offer.slug),
  LATEST_OFFERS_CACHE_KEY,
  RELATED_OFFERS_CACHE_KEY,
 ]);
};

// ==================== Gallery Images ====================

export const syncOfferImages = async (
 offerId: string,
 images: Array<{ caption?: string; image_id: number; order?: number }>
) => {
 const offer = await getOfferById(offerId);
 if (!offer) {
  throw new Error('Offer not found');
 }
 // Delete existing gallery images
 await db.delete(OfferImages).where(eq(OfferImages.offer_id, offerId));

 // Insert new gallery images
 if (images.length > 0) {
  await db.insert(OfferImages).values(
   images.map((img, index) => ({
    ...img,
    offer_id: offerId,
    order: img.order ?? index,
   }))
  );
 }

 revalidatePath('/offers');
 revalidatePath(`/offers/${offerId}`);
 revalidateTags([
  OFFERS_CACHE_KEY,
  getOfferBySlugKey(offer.slug),
  LATEST_OFFERS_CACHE_KEY,
  RELATED_OFFERS_CACHE_KEY,
 ]);
};

// ==================== FAQs ====================

export const syncOfferFaqs = async (offerId: string, faqIds: number[]) => {
 const offer = await getOfferById(offerId);
 if (!offer) {
  throw new Error('Offer not found');
 }
 // Delete existing FAQ links
 await db.delete(OfferFaqs).where(eq(OfferFaqs.offer_id, offerId));

 // Insert new FAQ links
 if (faqIds.length > 0) {
  await db.insert(OfferFaqs).values(
   faqIds.map((faqId, index) => ({
    faq_id: faqId,
    offer_id: offerId,
    order: index,
   }))
  );
 }

 revalidatePath('/offers');
 revalidatePath(`/offers/${offerId}`);
 revalidateTags([
  OFFERS_CACHE_KEY,
  getOfferBySlugKey(offer.slug),
  LATEST_OFFERS_CACHE_KEY,
  RELATED_OFFERS_CACHE_KEY,
 ]);
};
