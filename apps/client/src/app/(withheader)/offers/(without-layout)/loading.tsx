import { Skeleton } from "@/components/ui/skeleton";

export default function OffersLoading() {
    return (
        <div className="mx-auto grid w-full max-w-screen-xl grid-cols-1 gap-6 px-4 md:grid-cols-2 lg:grid-cols-4 xl:px-0">
            {[...Array(8)].map((_, i) => (
                <div
                    className="flex flex-col overflow-hidden rounded-lg bg-white shadow-sm"
                    key={i}
                >
                    {/* Image */}
                    <Skeleton className="aspect-[4/3] w-full" />

                    {/* Content */}
                    <div className="flex flex-grow flex-col p-6">
                        <Skeleton className="mb-2 h-6 w-full" />
                        <Skeleton className="mb-3 h-4 w-24" />
                        <div className="mb-6 flex-grow space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                        </div>
                        <Skeleton className="h-11 w-full rounded-sm" />
                    </div>
                </div>
            ))}
        </div>
    );
}
