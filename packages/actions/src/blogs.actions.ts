"use server";
import { and, count, eq, ilike, notInArray } from "@repo/db";
import { Blogs, db } from "@repo/db";
import { TBlogCategory, TNewBlog } from "@repo/db/schema/blogs.schema";

import { bumpVersion, getOrSet } from "./libs/cache";
import { blogBySlugKey, featuredBlogsKey } from "./libs/keys";
import { safeDbQuery } from "./utils/db-error-handler";

import type { TBlog } from "@repo/db/schema/types.schema";

type TGetBlogsFilters = {
  category?: string;
  ignore?: number[];
  is_featured?: boolean;
  limit?: number;
  page?: number;
  search?: string;
  status?: "archived" | "draft" | "published";
};

export const getBlogs = async (filters: TGetBlogsFilters = {}) => {
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
      const result = await db
        .select({ count: count() })
        .from(Blogs)
        .where(where);
      return result[0]?.count ?? 0;
    },
    0,
    "blogs",
    "count query"
  );

  const total = typeof totalResult === "number" ? totalResult : 0;

  const page = Math.max(1, filters.page || 1);
  const limit = Math.max(1, filters.limit || 10);
  const offset = (page - 1) * limit;

  const blogs = await safeDbQuery(
    async () => {
      return await db.query.Blogs.findMany({
        limit,
        offset,
        orderBy: (blogs, { desc }) => [desc(blogs.published_at)],
        where,
        with: {
          author: true,
          featuredImage: true,
          images: {
            orderBy: (images, { asc }) => [asc(images.order)],
            with: { image: true },
          },
        },
      });
    },
    [],
    "blogs",
    "findMany query"
  );

  return {
    blogs: (blogs || []) as unknown as TBlog[],
    total,
  };
};

export const getBlogBySlug = async (slug: string) => {
  return getOrSet(
    () =>
      db.query.Blogs.findFirst({
        where: and(eq(Blogs.slug, slug), eq(Blogs.status, "published")),
        with: {
          author: true,
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
    where: and(eq(Blogs.category, category), eq(Blogs.status, "published")),
    with: {
      featuredImage: true,
    },
  });
};
export const getFeaturedBlogs = async (limit: number = 3) => {
  return getOrSet(
    () =>
      db!.query.Blogs.findMany({
        limit,
        orderBy: (blogs, { desc }) => [desc(blogs.published_at)],
        where: and(eq(Blogs.status, "published"), eq(Blogs.is_featured, 1)),
        with: {
          author: true,
          featuredImage: true,
        },
      }),
    {
      key: await featuredBlogsKey(),
    }
  );
};

export const createBlog = async (data: TNewBlog) => {
  const [blog] = await db.insert(Blogs).values(data).returning();

  await bumpVersion("blogs");

  return blog;
};

export const updateBlog = async (id: number, data: Partial<TNewBlog>) => {
  if (!db) throw new Error("Database connection not available");

  const [updated] = await db
    .update(Blogs)
    .set({ ...data, updated_at: new Date() })
    .where(eq(Blogs.id, id))
    .returning();

  await bumpVersion("blogs");

  return updated;
};

export const getBlogById = async (id: number) => {
  return db.query.Blogs.findFirst({
    where: eq(Blogs.id, id),
    with: {
      author: true,
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
  }
};

export const deleteBlog = async (id: number) => {
  await db.delete(Blogs).where(eq(Blogs.id, id));

  await bumpVersion("blogs");
};
