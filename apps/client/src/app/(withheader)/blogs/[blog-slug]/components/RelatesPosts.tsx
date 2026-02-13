import { getBlogs } from "@repo/actions/blogs.actions";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

import { getRelatedPostsCache } from "@/lib/cache/blogs.cache";

import { RelatedPostsSkeleton } from "./RelatedPostsSkeleton";

import type { TBlogCategory } from "@repo/db/schema/blogs.schema";

export async function RelatedPosts({
  category,
  ignore = [],
}: {
  category: TBlogCategory;
  ignore: number[];
}) {
  const relatedPosts = await getRelatedPostsCache(category, ignore);

  return (
    <section className="border-t border-gray-200 bg-gray-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2
          className={`mb-12 text-center text-3xl font-thin tracking-widest text-gray-900`}
        >
          Related Articles
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {relatedPosts.map((relatedPost) => (
            <Link
              className="group overflow-hidden rounded-lg bg-white shadow-md transition-all hover:shadow-xl"
              href={`/blogs/${relatedPost.slug}`}
              key={relatedPost.id}
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  alt={relatedPost.featuredImage?.alt_text || relatedPost.title}
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-110"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  src={
                    relatedPost.featuredImage?.original_url ||
                    "/path/to/placeholder-image.jpg"
                  }
                />
              </div>
              <div className="p-6">
                <h3
                  className={`text-lg font-light leading-tight text-gray-900 transition-colors group-hover:text-gray-600`}
                >
                  {relatedPost.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function RelatedPostsSuspense({
  category,
  ignore,
}: {
  category: TBlogCategory;
  ignore: number[];
}) {
  return (
    <Suspense fallback={<RelatedPostsSkeleton />}>
      <RelatedPosts category={category} ignore={ignore} />
    </Suspense>
  );
}
