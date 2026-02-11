import { getOfferBySlug, getOffers, getOffersOnly } from "@repo/actions/offers.actions";
import { cacheTag } from "next/cache";

export const OFFERS_CACHE_KEY = 'offers';
export const LATEST_OFFERS_CACHE_KEY = `${OFFERS_CACHE_KEY}:latest`;

export const getOfferBySlugKey = (slug: string) => {
    return `offer:slug:${slug}`;
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