import Link from "next/link";

import { BlogCard } from "./BlogCard";

import type { TBlog } from "@repo/db/schema/types.schema";

interface BlogListingProps {
  blogs: TBlog[];
  currentPage: number;
  totalPages: number;
}

export function BlogListing({ blogs, currentPage, totalPages }: BlogListingProps) {
  const getPageHref = (page: number) => {
    if (page === 1) return "/blogs";
    return `/blogs/page/${page}`;
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mb-12 flex flex-col items-center justify-between gap-4 sm:flex-row">
        <h2 className="text-2xl font-light tracking-wide text-gray-900 md:text-3xl">
          Latest Articles
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {blogs.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>

      {totalPages > 1 && (
        <nav aria-label="Blog pagination" className="mt-16 flex items-center justify-center gap-2">
          {currentPage > 1 ? (
            <Link
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 transition-all hover:border-gray-900 hover:bg-gray-900 hover:text-white"
              href={getPageHref(currentPage - 1)}
            >
              Previous
            </Link>
          ) : (
            <span className="cursor-not-allowed rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-400">
              Previous
            </span>
          )}

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Link
              className={`rounded-lg px-4 py-2 text-sm transition-all ${
                page === currentPage
                  ? "border border-gray-900 bg-gray-900 text-white"
                  : "border border-gray-300 text-gray-700 hover:border-gray-900 hover:bg-gray-900 hover:text-white"
              }`}
              href={getPageHref(page)}
              key={page}
            >
              {page}
            </Link>
          ))}

          {currentPage < totalPages ? (
            <Link
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 transition-all hover:border-gray-900 hover:bg-gray-900 hover:text-white"
              href={getPageHref(currentPage + 1)}
            >
              Next
            </Link>
          ) : (
            <span className="cursor-not-allowed rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-400">
              Next
            </span>
          )}
        </nav>
      )}
    </section>
  );
}
