import { getRecentEnquiries } from '@repo/actions';

import { RecentActivity } from '@/features/overview/components/recent-activity';

export default async function Sales() {
  const { contactQueries, offerBookings } = await getRecentEnquiries(5);
  return <RecentActivity contactQueries={contactQueries} offerBookings={offerBookings} />;
}
