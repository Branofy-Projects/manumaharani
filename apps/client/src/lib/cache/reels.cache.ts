import { getActiveReels } from "@repo/actions/reels.actions";
import { cacheLife, cacheTag } from "next/cache";

export const REELS_CACHE_KEY = 'reels';

export const getActiveReelsCache = async () => {
    'use cache';
    cacheTag(REELS_CACHE_KEY);
    cacheLife("days");

    return await getActiveReels();
};
