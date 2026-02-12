import { Skeleton } from '@/components/ui/skeleton';

export default function OfferDetailLoading() {
    return (
        <main className="min-h-screen bg-background pt-[72px] md:pt-[88px]">
            {/* Breadcrumb */}
            <div className="border-b border-b-gray-200 bg-gray-50">
                <div className="mx-auto max-w-screen-xl px-4 py-3">
                    <nav className="flex items-center gap-2">
                        <Skeleton className="h-4 w-12" />
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-4 w-32" />
                    </nav>
                </div>
            </div>

            {/* Gallery Skeleton */}
            <div className="bg-gray-50">
                <div className="mx-auto max-w-screen-xl px-4 py-4">
                    {/* Mobile */}
                    <Skeleton className="aspect-[16/9] max-h-[400px] w-full rounded-2xl md:hidden" />

                    {/* Tablet */}
                    <div className="hidden h-[350px] grid-cols-3 grid-rows-2 gap-2 md:grid lg:hidden">
                        <Skeleton className="col-span-2 row-span-2 rounded-l-2xl" />
                        <Skeleton className="rounded-tr-2xl" />
                        <Skeleton className="rounded-br-2xl" />
                    </div>

                    {/* Desktop */}
                    <div className="hidden h-[400px] grid-cols-4 grid-rows-2 gap-2 lg:grid xl:h-[450px] 2xl:h-[500px]">
                        <Skeleton className="col-span-2 row-span-2 rounded-l-2xl" />
                        <Skeleton className="" />
                        <Skeleton className="rounded-tr-2xl" />
                        <Skeleton className="" />
                        <Skeleton className="rounded-br-2xl" />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="mx-auto max-w-screen-xl px-4 py-8">
                <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
                    {/* Left Column */}
                    <div className="lg:col-span-2">
                        {/* Title */}
                        <div className="mb-6">
                            <Skeleton className="mb-3 h-10 w-3/4" />
                            <div className="flex flex-wrap items-center gap-3">
                                <Skeleton className="h-7 w-20 rounded" />
                                <Skeleton className="h-5 w-28" />
                                <Skeleton className="h-5 w-36" />
                            </div>
                        </div>

                        {/* Key Info Pills */}
                        <div className="mb-8 flex flex-wrap gap-3">
                            <Skeleton className="h-10 w-40 rounded-full" />
                            <Skeleton className="h-10 w-28 rounded-full" />
                            <Skeleton className="h-10 w-36 rounded-full" />
                            <Skeleton className="h-10 w-32 rounded-full" />
                        </div>

                        {/* About Section */}
                        <div className="mb-10 border-t pt-8">
                            <Skeleton className="mb-4 h-8 w-56" />
                            <div className="space-y-3">
                                <Skeleton className="h-5 w-full" />
                                <Skeleton className="h-5 w-full" />
                                <Skeleton className="h-5 w-11/12" />
                                <Skeleton className="h-5 w-full" />
                                <Skeleton className="h-5 w-9/12" />
                            </div>
                        </div>

                        {/* What's Included Section */}
                        <div className="mb-10 border-t pt-8">
                            <Skeleton className="mb-6 h-8 w-44" />
                            <div className="grid gap-8 md:grid-cols-2">
                                <div className="space-y-3">
                                    {[...Array(4)].map((_, i) => (
                                        <div className="flex items-center gap-3" key={i}>
                                            <Skeleton className="h-5 w-5 rounded-full" />
                                            <Skeleton className="h-5 w-40" />
                                        </div>
                                    ))}
                                </div>
                                <div className="space-y-3">
                                    {[...Array(3)].map((_, i) => (
                                        <div className="flex items-center gap-3" key={i}>
                                            <Skeleton className="h-5 w-5 rounded-full" />
                                            <Skeleton className="h-5 w-36" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Itinerary Section */}
                        <div className="mb-10 border-t pt-8">
                            <Skeleton className="mb-6 h-8 w-48" />
                            <div className="space-y-6">
                                {[...Array(3)].map((_, i) => (
                                    <div className="flex gap-4" key={i}>
                                        <Skeleton className="h-8 w-8 flex-shrink-0 rounded-full" />
                                        <div className="flex-1 space-y-2">
                                            <Skeleton className="h-6 w-48" />
                                            <Skeleton className="h-4 w-full" />
                                            <Skeleton className="h-4 w-3/4" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* FAQs Section */}
                        <div className="mb-10 border-t pt-8">
                            <Skeleton className="mb-6 h-8 w-64" />
                            <div className="space-y-0 rounded-lg border border-gray-200">
                                {[...Array(4)].map((_, i) => (
                                    <div
                                        className="flex items-center justify-between border-b border-gray-200 p-4 last:border-b-0"
                                        key={i}
                                    >
                                        <Skeleton className="h-5 w-3/4" />
                                        <Skeleton className="h-5 w-5" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Booking Card */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
                            <Skeleton className="mb-1 h-4 w-16" />
                            <Skeleton className="mb-1 h-9 w-36" />
                            <Skeleton className="mb-4 h-4 w-24" />

                            <Skeleton className="mb-4 h-7 w-20 rounded" />

                            <div className="mb-6 space-y-3 border-b border-t border-gray-100 py-4">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-4 w-44" />
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <Skeleton className="mb-1 h-4 w-20" />
                                    <Skeleton className="h-9 w-full rounded-md" />
                                </div>
                                <div>
                                    <Skeleton className="mb-1 h-4 w-12" />
                                    <Skeleton className="h-9 w-full rounded-md" />
                                </div>
                                <div>
                                    <Skeleton className="mb-1 h-4 w-14" />
                                    <Skeleton className="h-9 w-full rounded-md" />
                                </div>
                                <div>
                                    <Skeleton className="mb-1 h-4 w-28" />
                                    <Skeleton className="h-9 w-24 rounded-md" />
                                </div>
                                <div>
                                    <Skeleton className="mb-1 h-4 w-24" />
                                    <Skeleton className="h-9 w-full rounded-md" />
                                </div>
                                <div>
                                    <Skeleton className="mb-1 h-4 w-16" />
                                    <Skeleton className="h-20 w-full rounded-md" />
                                </div>
                                <Skeleton className="h-12 w-full rounded-lg" />
                                <Skeleton className="mx-auto h-4 w-36" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Offers */}
                <div className="mt-16 border-t pt-12">
                    <Skeleton className="mb-2 h-8 w-56" />
                    <Skeleton className="mb-8 h-5 w-72" />
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i}>
                                <Skeleton className="aspect-[4/3] w-full rounded-xl" />
                                <div className="mt-3 space-y-2">
                                    <Skeleton className="h-5 w-3/4" />
                                    <Skeleton className="h-4 w-20" />
                                    <Skeleton className="h-4 w-16" />
                                    <Skeleton className="h-5 w-24" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
