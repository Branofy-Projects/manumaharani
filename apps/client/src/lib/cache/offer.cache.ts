import { getOfferBySlug, getOffersOnly, getRelatedOffers } from "@repo/actions/offers.actions";
import { cacheTag } from "next/cache";

import type { TOfferCategory } from "@repo/db/schema/offers.schema";

export const OFFERS_CACHE_KEY = 'offers';
export const LATEST_OFFERS_CACHE_KEY = `${OFFERS_CACHE_KEY}:latest`;

export const getOfferBySlugKey = (slug: string) => {
    return `offer:slug:${slug}`;
};

export const RELATED_OFFERS_CACHE_KEY = 'offers:related';

export const getRelatedOffersKey = (offerId: string, category?: TOfferCategory) => {
    return `offer:related:${offerId}:${category}`;
};

export const getOffersCache = async () => {
    'use cache';
    cacheTag(OFFERS_CACHE_KEY);
    return getOffersOnly({status:'active'});
};


export const getOfferBySlugCache = async (slug: string) => {
    'use cache';
    cacheTag(getOfferBySlugKey(slug));
    const cache = getOfferBySlug(slug);
    return cache;
};

export const getLatestOffersCache = async () => {
    'use cache';
    cacheTag(LATEST_OFFERS_CACHE_KEY);
    return getOffersOnly({limit: 2, status:'active'});
};

export const getRelatedOffersCache = async (offerId: string, category?: TOfferCategory, limit = 4) => {
    'use cache';
    cacheTag(RELATED_OFFERS_CACHE_KEY);
    cacheTag(getRelatedOffersKey(offerId, category));
    return getRelatedOffers(offerId, category, limit);
};