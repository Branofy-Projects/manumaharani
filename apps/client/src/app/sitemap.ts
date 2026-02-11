import { getBlogs } from '@repo/actions/blogs.actions';
import { getOffers } from '@repo/actions/offers.actions';
import { getRoomTypes } from '@repo/actions/room-types.actions';

import type { MetadataRoute } from 'next';

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
  const { blogs } = await getBlogs({ limit: 1000, status: 'published' });
  const blogRoutes = blogs.map((blog) => ({
    changeFrequency: 'weekly' as const,
    lastModified: new Date(blog.updated_at || blog.created_at || new Date()),
    priority: 0.6,
    url: `${BASE_URL}/blogs/${blog.slug}`,
  }));

  // Dynamic routes - Rooms
  const { roomTypes } = await getRoomTypes({ status: 'active' });
  const roomRoutes = roomTypes
    .filter((room) => room.slug)
    .map((room) => ({
      changeFrequency: 'weekly' as const,
      lastModified: new Date(room.updated_at || room.created_at || new Date()),
      priority: 0.8,
      url: `${BASE_URL}/rooms/${room.slug}`,
    }));

  // Dynamic routes - Offers
  const { offers } = await getOffers({ status: 'active' });
  const offerRoutes = offers
    .filter((offer) => offer.slug)
    .map((offer) => ({
      changeFrequency: 'weekly' as const,
      lastModified: new Date(offer.updated_at || offer.created_at || new Date()),
      priority: 0.7,
      url: `${BASE_URL}/offers/${offer.slug}`,
    }));

  return [...staticRoutes, ...roomRoutes, ...offerRoutes, ...blogRoutes, ...legalRoutes];
}
