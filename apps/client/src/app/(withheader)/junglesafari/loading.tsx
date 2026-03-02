import { Skeleton } from "@/components/ui/skeleton";

export default function JungleSafariLoading() {
    return (
        <main className="w-full overflow-x-hidden bg-[#f3eee7] pt-[72px] md:pt-[88px]">
            {/* Hero Section */}
            <section className="relative flex h-[70vh] min-h-[500px] w-full items-center overflow-hidden sm:h-[80vh] lg:min-h-[600px]">
                <Skeleton className="absolute inset-0 rounded-none" />
                <div className="relative z-10 mx-auto w-full max-w-7xl px-4 text-center sm:px-6 lg:px-8">
                    <Skeleton className="mx-auto mb-6 h-12 w-64 md:h-16 md:w-80" />
                    <Skeleton className="mx-auto h-5 w-full max-w-3xl md:h-6" />
                    <Skeleton className="mx-auto mt-2 h-5 w-3/4 max-w-2xl md:h-6" />
                </div>
            </section>

            {/* Intro Section */}
            <section className="bg-white py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="mx-auto max-w-4xl text-center">
                        <Skeleton className="mx-auto mb-8 h-9 w-80 md:h-12 md:w-96" />
                        <div className="space-y-3">
                            <Skeleton className="mx-auto h-5 w-full" />
                            <Skeleton className="mx-auto h-5 w-full" />
                            <Skeleton className="mx-auto h-5 w-11/12" />
                            <Skeleton className="mx-auto h-5 w-full" />
                        </div>
                        <div className="mt-6 space-y-3">
                            <Skeleton className="mx-auto h-5 w-full" />
                            <Skeleton className="mx-auto h-5 w-10/12" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Safari Zones Section */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="mb-12 text-center">
                        <Skeleton className="mx-auto mb-4 h-9 w-48 md:h-12 md:w-56" />
                        <Skeleton className="mx-auto h-5 w-full max-w-2xl" />
                    </div>

                    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                        {[...Array(8)].map((_, i) => (
                            <div className="overflow-hidden rounded-lg bg-white" key={i}>
                                <Skeleton className="h-[220px] w-full rounded-none" />
                                <div className="p-4">
                                    <Skeleton className="mb-2 h-4 w-full" />
                                    <Skeleton className="mb-4 h-4 w-3/4" />

                                    {/* Timings */}
                                    <div className="mb-4 space-y-2 rounded-lg bg-[#f3eee7] p-3">
                                        <Skeleton className="h-4 w-40 bg-[#e8e0d5]" />
                                        <Skeleton className="h-4 w-44 bg-[#e8e0d5]" />
                                        <Skeleton className="h-4 w-36 bg-[#e8e0d5]" />
                                    </div>

                                    {/* Highlights */}
                                    <Skeleton className="mb-2 h-3 w-32" />
                                    <div className="mb-4 flex flex-wrap gap-1">
                                        <Skeleton className="h-6 w-16 rounded-full" />
                                        <Skeleton className="h-6 w-20 rounded-full" />
                                        <Skeleton className="h-6 w-14 rounded-full" />
                                        <Skeleton className="h-6 w-24 rounded-full" />
                                    </div>

                                    <Skeleton className="h-10 w-full rounded-lg" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Guidelines Section */}
            <section className="bg-white py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="mb-12 text-center">
                        <Skeleton className="mx-auto mb-4 h-9 w-56 md:h-12 md:w-72" />
                        <Skeleton className="mx-auto h-5 w-full max-w-2xl" />
                    </div>
                    <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {[...Array(6)].map((_, i) => (
                            <div className="rounded-lg border border-gray-100 p-6 text-center" key={i}>
                                <Skeleton className="mx-auto mb-3 h-10 w-10 rounded-full" />
                                <Skeleton className="mx-auto mb-2 h-5 w-24" />
                                <Skeleton className="mx-auto h-4 w-full" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Booking CTA Section */}
            <section className="relative overflow-hidden py-16 md:py-24">
                <Skeleton className="absolute inset-0 rounded-none" />
                <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
                    <Skeleton className="mx-auto mb-6 h-9 w-72 md:h-12 md:w-96" />
                    <Skeleton className="mx-auto mb-2 h-5 w-full max-w-xl" />
                    <Skeleton className="mx-auto mb-8 h-5 w-3/4 max-w-md" />
                    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Skeleton className="h-14 w-48 rounded-lg" />
                        <Skeleton className="h-14 w-48 rounded-lg" />
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="bg-white py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="mx-auto max-w-4xl">
                        <div className="mb-12 text-center">
                            <Skeleton className="mx-auto mb-4 h-9 w-72 md:h-12 md:w-96" />
                            <Skeleton className="mx-auto h-5 w-full max-w-xl" />
                        </div>
                        <div className="space-y-3">
                            {[...Array(6)].map((_, i) => (
                                <div className="flex items-center justify-between rounded-lg border border-gray-200 p-5" key={i}>
                                    <Skeleton className="h-5 w-3/4" />
                                    <Skeleton className="h-5 w-5" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Bottom Banner */}
            <section className="bg-gray-900 py-8">
                <div className="container mx-auto px-4 text-center">
                    <Skeleton className="mx-auto h-4 w-96 max-w-full bg-gray-700" />
                </div>
            </section>
        </main>
    );
}
