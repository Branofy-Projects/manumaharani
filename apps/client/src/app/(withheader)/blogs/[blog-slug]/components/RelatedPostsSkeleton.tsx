import { Skeleton } from "@/components/ui/skeleton";

export function RelatedPostsSkeleton() {
  return (
    <section className="border-t border-gray-200 bg-gray-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2
          className={`mb-12 text-center text-3xl  tracking-widest text-gray-900`}
        >
          Related Articles
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="group overflow-hidden rounded-lg bg-white shadow-md transition-all hover:shadow-xl"
            >
              <div className="relative h-48 overflow-hidden">
                <Skeleton className="w-full h-full" />
              </div>
              <div className="p-6">
                <Skeleton className="h-6 w-3/4 mb-2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

