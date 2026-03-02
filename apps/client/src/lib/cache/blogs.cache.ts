import { getBlogBySlug, getBlogs,getBlogsOnly } from "@repo/actions/blogs.actions";
import { cacheTag } from "next/cache";

import type { TBlogCategory } from "@repo/db/schema/blogs.schema";

export const BLOGS_CACHE_KEY = 'blogs';
export const LATEST_BLOGS_CACHE_KEY = `${BLOGS_CACHE_KEY}:latest`;

export const getBlogBySlugKey = (slug: string) => {
    return `blog:slug:${slug}`;
};

export const getLatestBlogsCache = async () => {
    'use cache';
    cacheTag(LATEST_BLOGS_CACHE_KEY);
    return getBlogsOnly({limit: 3, status:'published'}, {published_at: 'desc'});
};

export const getBlogsCache = async () => {
    'use cache';
    cacheTag(BLOGS_CACHE_KEY);
    return getBlogsOnly({status:'published'}, {published_at: 'desc'});
};

export const getBlogsWithPaginationCache = async (page: number, limit: number) => {
    'use cache';
    cacheTag(BLOGS_CACHE_KEY);
    return getBlogs({limit, page, status:'published'}, {published_at: 'desc'});
};

export const getBlogBySlugCache = async (slug: string) => {
    'use cache';
    cacheTag(getBlogBySlugKey(slug));
    return getBlogBySlug(slug);
};

export const getRelatedBlogsKey = (category: TBlogCategory, ignore: number[]) => {
    return `${BLOGS_CACHE_KEY}:related:${category}:ignore:${ignore.join(',')}`;
};

export const getRelatedPostsCache = async (category: TBlogCategory, ignore: number[]) =>{
    'use cache';
    cacheTag(getRelatedBlogsKey(category, ignore));
    return getBlogsOnly({
        category,
        ignore,
        limit: 3,
        status: "published",
      });
};