import { notFound, redirect } from "next/navigation";

import { BlogListing } from "@/components/Blogs/BlogListing";
import { getBlogsWithPaginationCache } from "@/lib/cache/blogs.cache";

import type { Metadata } from "next";

const BLOGS_PER_PAGE = 9;

export const metadata: Metadata = {
  description: "Read the latest blog posts from ManuMaharani Jungle Resort.",
  title: `Blog Posts | ManuMaharani`,
};

export default async function BlogsPaginatedPage(props: PageProps<"/blogs/page/[pageNum]">) {
  const { pageNum } = await props.params;
  const page = Number(pageNum);

  if (isNaN(page) || page < 1 || !Number.isInteger(page)) {
    notFound();
  }

  if (page === 1) {
    redirect("/blogs");
  }

  const { blogs, total } = await getBlogsWithPaginationCache(page, BLOGS_PER_PAGE);
  const totalPages = Math.ceil(total / BLOGS_PER_PAGE);

  if (page > totalPages && totalPages > 0) {
    notFound();
  }

  if (blogs.length === 0) {
    redirect("/blogs");
  }

  return (
    <BlogListing blogs={blogs} currentPage={page} totalPages={totalPages} />
  );
}

