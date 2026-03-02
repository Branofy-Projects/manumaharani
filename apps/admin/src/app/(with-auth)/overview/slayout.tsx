import { getDashboardStats } from '@repo/actions';
import { IconCalendarEvent, IconClockHour4, IconMail, IconMessageCircle } from '@tabler/icons-react';
import React from 'react';

import PageContainer from '@/components/layout/page-container';
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

export default async function OverViewLayout({
  area_stats,
  bar_stats,
  pie_stats,
  sales
}: {
  area_stats: React.ReactNode;
  bar_stats: React.ReactNode;
  pie_stats: React.ReactNode;
  sales: React.ReactNode;
}) {
  const stats = await getDashboardStats();

  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-2'>
        <div className='flex items-center justify-between space-y-2'>
          <h2 className='text-2xl font-bold tracking-tight'>
            Hi, Welcome back 👋
          </h2>
        </div>

        <div className='*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs md:grid-cols-2 lg:grid-cols-4'>
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
        </div>

        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7'>
          <div className='col-span-4'>{bar_stats}</div>
          <div className='col-span-4 md:col-span-3'>
            {sales}
          </div>
          <div className='col-span-4'>{area_stats}</div>
          <div className='col-span-4 md:col-span-3'>{pie_stats}</div>
        </div>
      </div>
    </PageContainer>
  );
}
