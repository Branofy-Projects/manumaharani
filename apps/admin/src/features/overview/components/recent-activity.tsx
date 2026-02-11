import { IconCalendarEvent, IconMail } from '@tabler/icons-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import type { TContactQuery } from '@repo/db/schema/contact-queries.schema';
import type { TOfferBooking } from '@repo/db/schema/offer-bookings.schema';

interface RecentActivityProps {
  contactQueries: TContactQuery[];
  offerBookings: TOfferBookingWithOffer[];
}

type TOfferBookingWithOffer = {
  offer: { name: string } | null;
} & TOfferBooking;

const statusVariant = (status: string) => {
  if (status === 'confirmed' || status === 'resolved') return 'default';
  if (status === 'cancelled' || status === 'closed') return 'destructive';
  return 'secondary';
};

export function RecentActivity({ contactQueries, offerBookings }: RecentActivityProps) {
  const allItems = [
    ...contactQueries.map((q) => ({
      createdAt: q.created_at,
      email: q.email,
      name: q.name,
      status: q.status,
      subtitle: q.subject,
      type: 'enquiry' as const,
    })),
    ...offerBookings.map((b) => ({
      createdAt: b.created_at,
      email: b.email,
      name: b.name,
      status: b.status,
      subtitle: b.offer?.name || 'Offer booking',
      type: 'booking' as const,
    })),
  ]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 7);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest enquiries and offer bookings</CardDescription>
      </CardHeader>
      <CardContent>
        {allItems.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-8">No recent activity</p>
        ) : (
          <div className="space-y-5">
            {allItems.map((item, index) => (
              <div className="flex items-start gap-3" key={index}>
                <div className={`mt-0.5 rounded-full p-1.5 ${item.type === 'enquiry' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
                  {item.type === 'enquiry' ? (
                    <IconMail className="size-3.5" />
                  ) : (
                    <IconCalendarEvent className="size-3.5" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <Badge className="shrink-0" variant={statusVariant(item.status)}>
                      {item.status}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-xs truncate">{item.subtitle}</p>
                  <p className="text-muted-foreground text-xs mt-0.5">
                    {new Date(item.createdAt).toLocaleDateString('en-US', {
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      month: 'short',
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="mt-4 flex gap-3 text-xs">
          <Link className="text-primary hover:underline" href="/contact-queries">
            View all enquiries
          </Link>
          <Link className="text-primary hover:underline" href="/offer-bookings">
            View all bookings
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
