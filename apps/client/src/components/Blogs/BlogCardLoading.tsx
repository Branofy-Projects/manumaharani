import { Skeleton } from "@/components/ui/skeleton";

export function BlogCardLoading() {
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-md">
      <div className="relative h-64 overflow-hidden">
        <Skeleton className="h-full w-full" />
        <Skeleton className="absolute left-4 top-4 h-6 w-20 rounded-full" />
      </div>
      <div className="p-6">
        <div className="mb-3 flex items-center gap-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="mb-3 h-6 w-3/4" />
        <Skeleton className="mb-4 h-4 w-full" />
        <Skeleton className="mb-4 h-4 w-1/2" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  );
}
