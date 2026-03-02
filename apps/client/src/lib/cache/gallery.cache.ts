import { getAllGallery, getGalleryByCategory, getInstaGallery } from "@repo/actions/gallery.actions";
import { cacheTag } from "next/cache";

export const GALLERY_CACHE_KEY = 'gallery';
export const INSTA_GALLERY_CACHE_KEY = 'gallery:insta';

export const getAllGalleryCache = async () => {
    'use cache';
    cacheTag(GALLERY_CACHE_KEY);
    return getAllGallery();
};

export const getGalleryByCategoryCache = async (category: string) => {
    'use cache';
    cacheTag(GALLERY_CACHE_KEY);
    return getGalleryByCategory(category);
};

export const getInstaGalleryCache = async () => {
    'use cache';
    cacheTag(INSTA_GALLERY_CACHE_KEY);
    return getInstaGallery();
};
