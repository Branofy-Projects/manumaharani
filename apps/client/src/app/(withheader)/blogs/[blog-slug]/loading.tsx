import { Skeleton } from "@/components/ui/skeleton";

import { RelatedPostsSkeleton } from "./components/RelatedPostsSkeleton";

const BlogPostLoading = () => {
  return (
    <main className="min-h-screen w-full overflow-x-hidden pt-[72px] md:pt-[88px]">
      {/* Hero Image Skeleton */}
      <div className="relative aspect-[16/9] max-h-[500px] w-full overflow-hidden">
        <Skeleton className="h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
      </div>

      {/* Article Content Skeletons */}
      <article className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Breadcrumb Skeleton */}
        <nav className="mb-8 flex items-center gap-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-24" />
        </nav>

        {/* Category Badge Skeleton */}
        <div className="mb-4">
          <Skeleton className="inline-block h-6 w-24 rounded-full" />
        </div>

        {/* Title Skeleton */}
        <Skeleton className="mb-6 h-10 w-3/4" />

        {/* Meta Info Skeletons */}
        <div className="mb-12 flex flex-wrap items-center gap-6 border-b border-gray-200 pb-6">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-24" />
        </div>

        {/* Content Skeletons */}
        <div className="prose prose-lg max-w-none">
          <Skeleton className="mb-4 h-6 w-full" />
          <Skeleton className="mb-4 h-6 w-11/12" />
          <Skeleton className="mb-4 h-6 w-full" />
          <Skeleton className="mb-4 h-6 w-10/12" />
          <Skeleton className="mb-4 h-6 w-full" />
          <Skeleton className="mb-4 h-6 w-9/12" />
        </div>

        {/* Share Section Skeletons */}
        <div className="mt-16 border-t border-gray-200 pt-8">
          <Skeleton className="mb-4 h-6 w-48" />
          <div className="flex gap-4">
            <Skeleton className="h-10 w-28 rounded-lg" />
            <Skeleton className="h-10 w-28 rounded-lg" />
            <Skeleton className="h-10 w-28 rounded-lg" />
            <Skeleton className="h-10 w-28 rounded-lg" />
          </div>
        </div>

        {/* CTA Section Skeletons */}
        <div className="mt-16 rounded-lg bg-gray-50 p-8 text-center md:p-12">
          <Skeleton className="mb-4 h-8 w-3/4 mx-auto" />
          <Skeleton className="mb-8 h-6 w-full mx-auto" />
          <Skeleton className="inline-block h-12 w-60 rounded-lg" />
        </div>
      </article>

      {/* Related Posts Skeleton */}
      <RelatedPostsSkeleton />
    </main>
  );
};

export default BlogPostLoading;
