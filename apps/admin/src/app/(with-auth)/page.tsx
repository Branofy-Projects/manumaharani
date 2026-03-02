import { getDashboardStats, getRecentEnquiries } from '@repo/actions';
import { IconCalendarEvent, IconClockHour4, IconMail, IconMessageCircle, IconTicket, IconUsers } from '@tabler/icons-react';
import React, { Suspense } from 'react';

import PageContainer from '@/components/layout/page-container';
import {
    Card,
    CardAction,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
// import { AreaGraph } from '@/features/overview/components/area-graph';
// import { AreaGraphSkeleton } from '@/features/overview/components/area-graph-skeleton';
// import { BarGraph } from '@/features/overview/components/bar-graph';
// import { BarGraphSkeleton } from '@/features/overview/components/bar-graph-skeleton';
// import { PieGraph } from '@/features/overview/components/pie-graph';
// import { PieGraphSkeleton } from '@/features/overview/components/pie-graph-skeleton';
import { RecentActivity } from '@/features/overview/components/recent-activity';
import { RecentSalesSkeleton } from '@/features/overview/components/recent-sales-skeleton';

export default async function Dashboard() {
    const stats = await getDashboardStats();

    return (
        <PageContainer>
            <div className='flex flex-1 flex-col space-y-2'>
                <div className='flex items-center justify-between space-y-2'>
                    <h2 className='text-2xl font-bold tracking-tight'>
                        Hi, Welcome back 👋
                    </h2>
                </div>

                <div className='*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs md:grid-cols-2 lg:grid-cols-3'>
                    <Card className='@container/card'>
                        <CardHeader>
                            <CardDescription>Today&apos;s Enquiries</CardDescription>
                            <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                                {stats.contactQueries.today}
                            </CardTitle>
                            <CardAction>
                                <div className='bg-primary/10 text-primary rounded-full p-2'>
                                    <IconMail className='size-4' />
                                </div>
                            </CardAction>
                        </CardHeader>
                        <CardFooter className='flex-col items-start gap-1.5 text-sm'>
                            <div className='line-clamp-1 flex gap-2 font-medium'>
                                {stats.contactQueries.pending} pending
                            </div>
                            <div className='text-muted-foreground'>
                                Contact form submissions today
                            </div>
                        </CardFooter>
                    </Card>

                    <Card className='@container/card'>
                        <CardHeader>
                            <CardDescription>Total Enquiries</CardDescription>
                            <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                                {stats.contactQueries.total}
                            </CardTitle>
                            <CardAction>
                                <div className='bg-primary/10 text-primary rounded-full p-2'>
                                    <IconMessageCircle className='size-4' />
                                </div>
                            </CardAction>
                        </CardHeader>
                        <CardFooter className='flex-col items-start gap-1.5 text-sm'>
                            <div className='line-clamp-1 flex gap-2 font-medium'>
                                {stats.contactQueries.pending} awaiting response
                            </div>
                            <div className='text-muted-foreground'>
                                All contact queries received
                            </div>
                        </CardFooter>
                    </Card>

                    <Card className='@container/card'>
                        <CardHeader>
                            <CardDescription>Today&apos;s Offer Bookings</CardDescription>
                            <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                                {stats.offerBookings.today}
                            </CardTitle>
                            <CardAction>
                                <div className='bg-primary/10 text-primary rounded-full p-2'>
                                    <IconCalendarEvent className='size-4' />
                                </div>
                            </CardAction>
                        </CardHeader>
                        <CardFooter className='flex-col items-start gap-1.5 text-sm'>
                            <div className='line-clamp-1 flex gap-2 font-medium'>
                                {stats.offerBookings.pending} pending
                            </div>
                            <div className='text-muted-foreground'>
                                Offer booking requests today
                            </div>
                        </CardFooter>
                    </Card>

                    <Card className='@container/card'>
                        <CardHeader>
                            <CardDescription>Total Offer Bookings</CardDescription>
                            <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                                {stats.offerBookings.total}
                            </CardTitle>
                            <CardAction>
                                <div className='bg-primary/10 text-primary rounded-full p-2'>
                                    <IconClockHour4 className='size-4' />
                                </div>
                            </CardAction>
                        </CardHeader>
                        <CardFooter className='flex-col items-start gap-1.5 text-sm'>
                            <div className='line-clamp-1 flex gap-2 font-medium'>
                                {stats.offerBookings.pending} awaiting action
                            </div>
                            <div className='text-muted-foreground'>
                                All offer booking requests
                            </div>
                        </CardFooter>
                    </Card>

                    <Card className='@container/card'>
                        <CardHeader>
                            <CardDescription>Today&apos;s Event Bookings</CardDescription>
                            <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                                {stats.eventBookings.today}
                            </CardTitle>
                            <CardAction>
                                <div className='bg-primary/10 text-primary rounded-full p-2'>
                                    <IconTicket className='size-4' />
                                </div>
                            </CardAction>
                        </CardHeader>
                        <CardFooter className='flex-col items-start gap-1.5 text-sm'>
                            <div className='line-clamp-1 flex gap-2 font-medium'>
                                {stats.eventBookings.pending} pending
                            </div>
                            <div className='text-muted-foreground'>
                                Event booking requests today
                            </div>
                        </CardFooter>
                    </Card>

                    <Card className='@container/card'>
                        <CardHeader>
                            <CardDescription>Total Event Bookings</CardDescription>
                            <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                                {stats.eventBookings.total}
                            </CardTitle>
                            <CardAction>
                                <div className='bg-primary/10 text-primary rounded-full p-2'>
                                    <IconUsers className='size-4' />
                                </div>
                            </CardAction>
                        </CardHeader>
                        <CardFooter className='flex-col items-start gap-1.5 text-sm'>
                            <div className='line-clamp-1 flex gap-2 font-medium'>
                                {stats.eventBookings.pending} awaiting action
                            </div>
                            <div className='text-muted-foreground'>
                                All event booking requests
                            </div>
                        </CardFooter>
                    </Card>
                </div>

                <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7'>
                    {/* <div className='col-span-4'>
                        <Suspense fallback={<BarGraphSkeleton />}>
                            <BarGraph />
                        </Suspense>
                    </div> */}
                    <div className='col-span-4 md:col-span-3'>
                        <Suspense fallback={<RecentSalesSkeleton />}>
                            <RecentActivitySection />
                        </Suspense>
                    </div>
                    {/* <div className='col-span-4'>
                        <Suspense fallback={<AreaGraphSkeleton />}>
                            <AreaGraph />
                        </Suspense>
                    </div>
                    <div className='col-span-4 md:col-span-3'>
                        <Suspense fallback={<PieGraphSkeleton />}>
                            <PieGraph />
                        </Suspense>
                    </div> */}
                </div>
            </div>
        </PageContainer>
    );
}

async function RecentActivitySection() {
    const { contactQueries, offerBookings, eventBookings } = await getRecentEnquiries(5);
    return <RecentActivity contactQueries={contactQueries} eventBookings={eventBookings} offerBookings={offerBookings} />;
}
