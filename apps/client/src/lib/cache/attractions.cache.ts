import { getAttractionBySlug, getAttractions } from "@repo/actions/attractions.actions";
import { cacheLife, cacheTag } from "next/cache";

export const ATTRACTIONS_CACHE_KEY = 'attractions';

export const getAttractionBySlugKey = (slug: string) => {
    return `attraction:slug:${slug}`;
};

export const getAttractionBySlugCache = async (slug: string) => {
    'use cache';
    cacheTag(getAttractionBySlugKey(slug));
    const cache = getAttractionBySlug(slug);
    return cache;
};

export const getAttractionsCache = async (activeOnly = true) => {
    'use cache';
    cacheTag(ATTRACTIONS_CACHE_KEY);
    cacheLife("days");
    const cache = await getAttractions(activeOnly);
    return cache;
};
