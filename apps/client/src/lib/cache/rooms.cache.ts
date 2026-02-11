import { getActiveRoomTypes, getRoomTypeBySlug } from "@repo/actions/room-types.actions";
import { getRoomTypes } from "@repo/actions/room-types.actions";
import { cacheTag } from "next/cache";

export const ROOM_TYPES_CACHE_KEY = 'room';
export const ACTIVE_ROOM_TYPES_CACHE_KEY = `${ROOM_TYPES_CACHE_KEY}:active`;
export const getRoomTypeBySlugKey = (slug: string) => {
    return `${ROOM_TYPES_CACHE_KEY}:slug:${slug}`;
};

export const getRoomTypeBySlugCache = async (slug: string) => {
    'use cache';
    cacheTag(getRoomTypeBySlugKey(slug));
    const roomType = await getRoomTypeBySlug(slug);
    return roomType;
};

export const getRoomTypesCache = async () => {
    'use cache';
    cacheTag(ROOM_TYPES_CACHE_KEY);
    return getRoomTypes({status:"active"});
};


export const getActiveRoomTypesCache = async () => {
    'use cache';
    cacheTag(ACTIVE_ROOM_TYPES_CACHE_KEY);
    return getActiveRoomTypes();
};