import { getAttractions } from '@repo/actions/attractions.actions';
import { getAllBlogsSlugs } from '@repo/actions/blogs.actions';
import { getAllEventsSlugs } from '@repo/actions/events.actions';
import { getAllOffersSlugs } from '@repo/actions/offers.actions';
import { getAllRoomSlugs } from '@repo/actions/rooms.actions';

import type { MetadataRoute } from 'next';

export const dynamic = 'force-dynamic';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://manumaharani.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static routes - main pages
  const staticRoutes = [
    { priority: 1, route: '' },
    { priority: 0.9, route: '/rooms' },
    { priority: 0.9, route: '/offers' },
    { priority: 0.8, route: '/about-us' },
    { priority: 0.8, route: '/fine-dining' },
    { priority: 0.8, route: '/wedding' },
    { priority: 0.8, route: '/events' },
    { priority: 0.8, route: '/junglesafari' },
    { priority: 0.8, route: '/blogs' },
    { priority: 0.7, route: '/contact-us' },
    { priority: 0.7, route: '/junglesafari/book-safari' },
    { priority: 0.7, route: '/gallery' },
    { priority: 0.6, route: '/gallery/overview' },
    { priority: 0.6, route: '/gallery/room' },
    { priority: 0.6, route: '/gallery/dining' },
    { priority: 0.6, route: '/gallery/wedding' },
    { priority: 0.7, route: '/nearby-attractions' },
  ].map(({ priority, route }) => ({
    changeFrequency: 'weekly' as const,
    lastModified: new Date(),
    priority,
    url: `${BASE_URL}${route}`,
  }));

  // Legal/policy pages - lower priority, rarely change
  const legalRoutes = [
    '/legal-notice',
    '/privacy-notice',
    '/privacy-policy',
    '/cookie-preferences',
    '/do-not-sell',
    '/accessibility-policy',
    '/modern-slavery-statement',
  ].map((route) => ({
    changeFrequency: 'yearly' as const,
    lastModified: new Date(),
    priority: 0.3,
    url: `${BASE_URL}${route}`,
  }));

  // Dynamic routes - Blogs
  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const blogs = await getAllBlogsSlugs({ limit: 1000, status: 'published' });
    blogRoutes = blogs.map((blog) => ({
      changeFrequency: 'weekly' as const,
      lastModified: new Date(blog.updated_at || blog.created_at || new Date()),
      priority: 0.6,
      url: `${BASE_URL}/blogs/${blog.slug}`,
    }));
  } catch (e) {
    console.error('Sitemap: failed to fetch blogs', e);
  }

  // Dynamic routes - Rooms
  let roomRoutes: MetadataRoute.Sitemap = [];
  try {
  const rooms = await getAllRoomSlugs();
    roomRoutes = rooms
      .filter((room) => room.slug)
      .map((room) => ({
        changeFrequency: 'weekly' as const,
        lastModified: new Date(room.updated_at || room.created_at || new Date()),
        priority: 0.8,
        url: `${BASE_URL}/rooms/${room.slug}`,
      }));
  } catch (e) {
    console.error('Sitemap: failed to fetch rooms', e);
  }

  // Dynamic routes - Offers
  let offerRoutes: MetadataRoute.Sitemap = [];
  try {
    const offers = await getAllOffersSlugs({ status: 'active' });
    offerRoutes = offers
      .filter((offer) => offer.slug)
      .map((offer) => ({
        changeFrequency: 'weekly' as const,
        lastModified: new Date(offer.updated_at || offer.created_at || new Date()),
        priority: 0.7,
        url: `${BASE_URL}/offers/${offer.slug}`,
      }));
  } catch (e) {
    console.error('Sitemap: failed to fetch offers', e);
  }

  // Dynamic routes - Events
  let eventRoutes: MetadataRoute.Sitemap = [];
  try {
    const events = await getAllEventsSlugs();
    eventRoutes = events
      .filter((event) => event.slug)
      .map((event) => ({
        changeFrequency: 'daily' as const,
        lastModified: new Date(event.updated_at || event.created_at || new Date()),
        priority: 0.7,
        url: `${BASE_URL}/events/${event.slug}`,
      }));
  } catch (e) {
    console.error('Sitemap: failed to fetch events', e);
  }

  // Dynamic routes - Attractions
  let attractionRoutes: MetadataRoute.Sitemap = [];
  try {
    const attractions = await getAttractions(true);
    attractionRoutes = attractions
      .filter((attraction) => attraction.slug)
      .map((attraction) => ({
        changeFrequency: 'weekly' as const,
        lastModified: new Date(attraction.updated_at || attraction.created_at || new Date()),
        priority: 0.6,
        url: `${BASE_URL}/nearby-attractions/${attraction.slug}`,
      }));
  } catch (e) {
    console.error('Sitemap: failed to fetch attractions', e);
  }

  return [...staticRoutes, ...roomRoutes, ...offerRoutes, ...eventRoutes, ...attractionRoutes, ...blogRoutes, ...legalRoutes];
}
