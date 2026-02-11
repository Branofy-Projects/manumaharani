'use server';
import { and, asc, count, eq, ilike, notInArray } from '@repo/db';
import { Blogs, db } from '@repo/db';

import { revalidateTags } from './client.actions';
import {
 BLOGS_CACHE_KEY,
 bumpVersion,
 getBlogBySlugKey,
 getOrSet,
 getRelatedBlogsKey,
 LATEST_BLOGS_CACHE_KEY,
} from './libs/cache';
import { blogBySlugKey } from './libs/keys';
import { safeDbQuery } from './utils/db-error-handler';

import type { TNewBlog } from '@repo/db/schema/blogs.schema';
import type { TBlogCategory } from '@repo/db/schema/blogs.schema';
import type { TBlog } from '@repo/db/schema/types.schema';

export type TGetBlogsFilters = {
 category?: TBlogCategory;
 ignore?: number[];
 is_featured?: boolean;
 limit?: number;
 page?: number;
 search?: string;
 status?: 'archived' | 'draft' | 'published';
};

type TGetBlogsOrderBy = {
 published_at?: 'asc' | 'desc';
};

const revalidateAllBlogs = () => {
 revalidateTags([BLOGS_CACHE_KEY, LATEST_BLOGS_CACHE_KEY]);
};

const revalidateBlog = async (slug: string) => {
 revalidateTags([
  BLOGS_CACHE_KEY,
  LATEST_BLOGS_CACHE_KEY,
  getBlogBySlugKey(slug),
 ]);
};

const revalidateRelatedBlogs = async (
 category: TBlogCategory,
 ignore: number[]
) => {
 revalidateTags([getRelatedBlogsKey(category, ignore)]);
};

export const getBlogs = async (
 filters: TGetBlogsFilters = {},
 orderBy: TGetBlogsOrderBy = {}
) => {
 const conditions = [];

 if (filters.search) {
  conditions.push(ilike(Blogs.title, `%${filters.search}%`));
 }

 if (filters.status) {
  conditions.push(eq(Blogs.status, filters.status));
 }

 if (filters.category) {
  conditions.push(eq(Blogs.category, filters.category as any));
 }

 if (filters.is_featured !== undefined) {
  conditions.push(eq(Blogs.is_featured, filters.is_featured ? 1 : 0));
 }

 if (filters.ignore && filters.ignore.length > 0) {
  conditions.push(notInArray(Blogs.id, filters.ignore));
 }

 const where = conditions.length > 0 ? and(...conditions) : undefined;

 const totalResult = await safeDbQuery(
  async () => {
   const result = await db.select({ count: count() }).from(Blogs).where(where);
   return result[0]?.count ?? 0;
  },
  0,
  'blogs',
  'count query'
 );

 const total = typeof totalResult === 'number' ? totalResult : 0;

 const page = Math.max(1, filters.page || 1);
 const limit = Math.max(1, filters.limit || 10);
 const offset = (page - 1) * limit;

 const blogs = await safeDbQuery(
  async () => {
   return await db.query.Blogs.findMany({
    limit,
    offset,
    orderBy: (blogs, { desc }) => [
     orderBy.published_at === 'asc'
      ? asc(blogs.published_at)
      : desc(blogs.published_at),
    ],
    where,
    with: {
     featuredImage: true,
     images: {
      orderBy: (images, { asc }) => [asc(images.order)],
      with: { image: true },
     },
    },
   });
  },
  [],
  'blogs',
  'findMany query'
 );

 return {
  blogs: (blogs || []) as unknown as TBlog[],
  total,
 };
};

export const getBlogsOnly = async (
 filters: TGetBlogsFilters = {},
 orderBy: TGetBlogsOrderBy = {}
) => {
 const conditions = [];

 if (filters.search) {
  conditions.push(ilike(Blogs.title, `%${filters.search}%`));
 }

 if (filters.status) {
  conditions.push(eq(Blogs.status, filters.status));
 }

 if (filters.category) {
  conditions.push(eq(Blogs.category, filters.category as any));
 }

 if (filters.is_featured !== undefined) {
  conditions.push(eq(Blogs.is_featured, filters.is_featured ? 1 : 0));
 }

 if (filters.ignore && filters.ignore.length > 0) {
  conditions.push(notInArray(Blogs.id, filters.ignore));
 }

 const where = conditions.length > 0 ? and(...conditions) : undefined;

 const page = Math.max(1, filters.page || 1);
 const limit = Math.max(1, filters.limit || 10);
 const offset = (page - 1) * limit;

 const blogs = await safeDbQuery(
  async () => {
   return await db.query.Blogs.findMany({
    limit,
    offset,
    orderBy: (blogs, { asc, desc }) => [
     orderBy.published_at === 'asc'
      ? asc(blogs.published_at)
      : desc(blogs.published_at),
    ],
    where,
    with: {
     featuredImage: true,
     images: {
      orderBy: (images, { asc }) => [asc(images.order)],
      with: { image: true },
     },
    },
   });
  },
  [],
  'blogs',
  'findMany query'
 );

 return blogs;
};

export const getBlogBySlug = async (slug: string) => {
 return getOrSet(
  () =>
   db.query.Blogs.findFirst({
    where: and(eq(Blogs.slug, slug), eq(Blogs.status, 'published')),
    with: {
     featuredImage: true,
     images: {
      orderBy: (images, { asc }) => [asc(images.order)],
      with: { image: true },
     },
    },
   }),
  {
   key: await blogBySlugKey(slug),
  }
 );
};

export const getRelatedPosts = async (
 category: TBlogCategory,
 limit: number = 3
) => {
 return db.query.Blogs.findMany({
  limit,
  orderBy: (blogs, { desc }) => [desc(blogs.published_at)],
  where: and(eq(Blogs.category, category), eq(Blogs.status, 'published')),
  with: {
   featuredImage: true,
   images: {
    orderBy: (images, { asc }) => [asc(images.order)],
    with: { image: true },
   },
  },
 });
};

export const updateBlog = async (id: number, data: Partial<TNewBlog>) => {
 if (!db) throw new Error('Database connection not available');

 const [updated] = await db
  .update(Blogs)
  .set({ ...data, updated_at: new Date() })
  .where(eq(Blogs.id, id))
  .returning();

 await bumpVersion('blogs');
 await revalidateBlog(updated.slug);
 revalidateRelatedBlogs(updated.category, [id]);

 return updated;
};

export const getBlogById = async (id: number) => {
 return db.query.Blogs.findFirst({
  where: eq(Blogs.id, id),
  with: {
   featuredImage: true,
   images: {
    orderBy: (images, { asc }) => [asc(images.order)],
    with: { image: true },
   },
  },
 });
};

export const incrementBlogViewCount = async (id: number) => {
 const blog = await db.query.Blogs.findFirst({
  where: eq(Blogs.id, id),
 });

 if (blog) {
  await db
   .update(Blogs)
   .set({ view_count: blog.view_count + 1 })
   .where(eq(Blogs.id, id));

  await revalidateBlog(blog.slug);
 }
};

export const deleteBlog = async (id: number) => {
 const [deleted] = await db.delete(Blogs).where(eq(Blogs.id, id)).returning();

 await bumpVersion('blogs');
 await revalidateAllBlogs();
 if (deleted) {
  revalidateRelatedBlogs(deleted.category, [id]);
 }
};

export const createBlog = async (data: TNewBlog) => {
 const [created] = await db.insert(Blogs).values(data).returning();

 await bumpVersion('blogs');
 await revalidateAllBlogs();
 revalidateRelatedBlogs(data.category, [created.id]);
 return created;
};
