import { getEventBySlug, getEvents } from "@repo/actions/events.actions";
import { cacheLife, cacheTag } from "next/cache";

export const EVENTS_CACHE_KEY = 'events';
export const UPCOMMING_EVENTS_CACHE_KEY = 'upcoming-events';

export const getEventBySlugKey = (slug: string) => {
    return `event:slug:${slug}`;
};

export const getEventBySlugCache = async (slug: string) => {
    'use cache';
    cacheTag(getEventBySlugKey(slug));
    const cache = getEventBySlug(slug);
    return cache;
};

export const getEventsCache = async () => {
    'use cache';
    cacheTag(EVENTS_CACHE_KEY);
    cacheLife("days");

    const fromDate = new Date().toISOString().split("T")[0];

    const cache = await getEvents({ 
        fromDate, 
        limit: 100, 
        upcomingOnly: true 
    });
    return cache;
};


export const getUpcomingEventsCache = async () => {
    'use cache';
    cacheTag(UPCOMMING_EVENTS_CACHE_KEY);
    cacheLife("days");

    const fromDate = new Date().toISOString().split("T")[0];

    const cache = await getEvents({ 
        fromDate, 
        limit: 3, 
        upcomingOnly: true 
    });

    return cache;
};