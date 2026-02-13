import { redis } from "./redis";

import type { TBlogCategory } from "@repo/db/schema/blogs.schema";
import type { TOfferCategory } from "@repo/db/schema/offers.schema";

type CacheOptions<T> = {
  deserialize?: (raw: string) => T;
  key: string;
  revalidate?: boolean;
  serialize?: (val: T) => string;
  swrSeconds?: number;
  ttlSeconds?: number;
};

export async function bumpVersion(namespace: string) {
  await redis.incr(`v:${namespace}`);
}

export async function getJSON<T>(key: string): Promise<null | T> {
  const raw = await redis.json.get<T>(key);
  return raw;
}

export async function getOrSet<T>(
  compute: () => Promise<T>,
  opts: CacheOptions<T>
): Promise<T> {
  const {
    deserialize = (v) => JSON.parse(v) as T,
    key,
    revalidate = false,
    serialize = (v) => JSON.stringify(v),
    ttlSeconds,
  } = opts;

  if (!revalidate) {
    const cached = await redis.get<string>(key);

    if (cached) {
      try {
        return deserialize(cached);
      } catch {
        // fallthrough to recompute on parse error
      }
    }
  }

  const data = await compute();
  
  const serialized = serialize(data);
  
  if (ttlSeconds && ttlSeconds > 0) {
    await redis.set(key, serialized, { ex: ttlSeconds });
  } else {
    await redis.set(key, serialized);
  }
  return data;
}

export async function getVersion(namespace: string): Promise<number> {
  const v = await redis.get<number>(`v:${namespace}`);
  return typeof v === "number" ? v : 0;
}

export async function setJSON<T>(key: string, val: T, ttlSeconds?: number) {
  const raw = JSON.stringify(val);
  if (ttlSeconds && ttlSeconds > 0) {
    await redis.set(key, raw, { ex: ttlSeconds });
  } else {
    await redis.set(key, raw);
  }
}

export const EVENTS_CACHE_KEY = 'events';
export const UPCOMMING_EVENTS_CACHE_KEY = 'upcoming-events';
export const LATEST_EVENTS_CACHE_KEY = `${EVENTS_CACHE_KEY}:latest`;

export const getEventBySlugKey = (slug: string) => {
    return `event:slug:${slug}`;
};

export const OFFERS_CACHE_KEY = 'offers';
export const LATEST_OFFERS_CACHE_KEY = `${OFFERS_CACHE_KEY}:latest`;

export const getOfferBySlugKey = (slug: string) => {
    return `offer:slug:${slug}`;
};

export const RELATED_OFFERS_CACHE_KEY = 'offers:related';

export const getRelatedOffersKey = (offerId: string, category?: TOfferCategory) => {
  return `offer:related:${offerId}:${category}`;
};

export const ROOM_TYPES_CACHE_KEY = 'room';
export const ACTIVE_ROOM_TYPES_CACHE_KEY = `${ROOM_TYPES_CACHE_KEY}:active`;
export const getRoomTypeBySlugKey = (slug: string) => {
    return `${ROOM_TYPES_CACHE_KEY}:slug:${slug}`;
};

export const BLOGS_CACHE_KEY = 'blogs';
export const LATEST_BLOGS_CACHE_KEY = `${BLOGS_CACHE_KEY}:latest`;

export const getRelatedBlogsKey = (category: TBlogCategory, ignore: number[]) => {
  return `${BLOGS_CACHE_KEY}:related:${category}:ignore:${ignore.join(',')}`;
};

export const getBlogBySlugKey = (slug: string) => {
    return `blog:slug:${slug}`;
};

export const REELS_CACHE_KEY = 'reels';

export const ATTRACTIONS_CACHE_KEY = 'attractions';

export const getAttractionBySlugKey = (slug: string) => {
    return `attraction:slug:${slug}`;
};