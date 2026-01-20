import { Skeleton } from '@/components/ui/skeleton';

export default function BlogsLoadingSection() {
    return (
        <>
            <div className="w-full max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12 mb-8 md:mb-12 px-4 md:px-0">
                {[1, 2, 3].map((idx) => (
                    <div className="flex flex-col items-start animate-pulse" key={idx}>
                        {/* Image skeleton */}
                        <div className="w-full aspect-[4/5] overflow-hidden mb-6">
                            <Skeleton className="h-full w-full" />
                        </div>

                        {/* Title skeleton */}
                        <Skeleton className="mb-3 h-6 w-3/4" />

                        {/* Read time skeleton */}
                        <div className="mb-3 flex items-center gap-2 text-sm w-1/3">
                            <Skeleton className="h-4 w-4 rounded-full" />
                            <Skeleton className="h-4 flex-1" />
                        </div>

                        {/* Excerpt skeleton */}
                        <div className="mb-3 w-full space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                        </div>

                        {/* Read more skeleton */}
                        <Skeleton className="mt-2 h-4 w-24" />
                    </div>
                ))}
            </div>

            <button className="border border-black px-6 md:px-8 py-2 md:py-3 text-black tracking-widest font-medium uppercase text-xs md:text-base hover:bg-black hover:text-white transition">
                Discover More
            </button>
        </>
    );
}
