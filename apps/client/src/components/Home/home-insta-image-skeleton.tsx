import { Skeleton } from "@/components/ui/skeleton";

export default function HomeInstaImageSkeleton() {
  return (
    <section className="w-full py-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <Skeleton className="h-4 w-24 mx-auto mb-4" />
          <Skeleton className="h-9 w-80 mx-auto" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Skeleton className="aspect-square rounded-none" />
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton className="aspect-square rounded-none" key={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
