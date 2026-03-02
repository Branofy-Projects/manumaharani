import { Skeleton } from "@/components/ui/skeleton";

export default function BookSafariLoading() {
    return (
        <main className="w-full overflow-x-hidden bg-[#f3eee7] pt-[72px] md:pt-[88px]">
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="mx-auto max-w-4xl">
                        {/* Header */}
                        <div className="mb-12 text-center">
                            <Skeleton className="mx-auto mb-4 h-10 w-64 md:h-14 md:w-80" />
                            <Skeleton className="mx-auto h-5 w-full max-w-2xl" />
                        </div>

                        {/* Form Card */}
                        <div className="rounded-lg bg-white p-8 shadow-lg md:p-12">
                            {/* Contact Information */}
                            <div className="mb-8">
                                <Skeleton className="mb-6 h-7 w-52 md:h-8" />

                                {/* Full Name */}
                                <div className="mb-6">
                                    <Skeleton className="mb-2 h-5 w-24" />
                                    <Skeleton className="h-12 w-full rounded-lg" />
                                </div>

                                {/* Email and Phone */}
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div>
                                        <Skeleton className="mb-2 h-5 w-16" />
                                        <Skeleton className="h-12 w-full rounded-lg" />
                                    </div>
                                    <div>
                                        <Skeleton className="mb-2 h-5 w-32" />
                                        <Skeleton className="h-12 w-full rounded-lg" />
                                    </div>
                                </div>
                            </div>

                            {/* Booking Details */}
                            <div className="mb-8">
                                <Skeleton className="mb-6 h-7 w-40 md:h-8" />

                                {/* Safari Zone */}
                                <div className="mb-6">
                                    <Skeleton className="mb-2 h-5 w-24" />
                                    <Skeleton className="h-12 w-full rounded-lg" />
                                </div>

                                {/* Date and Time */}
                                <div className="mb-6 grid gap-6 md:grid-cols-2">
                                    <div>
                                        <Skeleton className="mb-2 h-5 w-32" />
                                        <Skeleton className="h-12 w-full rounded-lg" />
                                    </div>
                                    <div>
                                        <Skeleton className="mb-2 h-5 w-24" />
                                        <Skeleton className="h-12 w-full rounded-lg" />
                                    </div>
                                </div>

                                {/* Adults and Children */}
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div>
                                        <Skeleton className="mb-2 h-5 w-36" />
                                        <Skeleton className="h-12 w-full rounded-lg" />
                                    </div>
                                    <div>
                                        <Skeleton className="mb-2 h-5 w-40" />
                                        <Skeleton className="h-12 w-full rounded-lg" />
                                    </div>
                                </div>
                            </div>

                            {/* Special Requests */}
                            <div className="mb-8">
                                <Skeleton className="mb-2 h-5 w-52" />
                                <Skeleton className="h-[120px] w-full rounded-lg" />
                            </div>

                            {/* Action Buttons */}
                            <div className="grid gap-4 md:grid-cols-2">
                                <Skeleton className="h-12 w-full rounded-lg" />
                                <Skeleton className="h-12 w-full rounded-lg" />
                            </div>

                            {/* Cancellation Note */}
                            <div className="mt-8 rounded-lg bg-[#f3eee7] p-4 text-center">
                                <Skeleton className="mx-auto h-4 w-72 bg-[#e8e0d5]" />
                            </div>
                        </div>

                        {/* Important Information */}
                        <div className="mt-12 rounded-lg bg-white p-6 shadow-md">
                            <Skeleton className="mb-4 h-6 w-48" />
                            <div className="space-y-3">
                                {[...Array(5)].map((_, i) => (
                                    <div className="flex items-start gap-2" key={i}>
                                        <Skeleton className="mt-1 h-4 w-4 flex-shrink-0" />
                                        <Skeleton className="h-4 w-full" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
