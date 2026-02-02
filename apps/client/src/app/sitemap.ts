import { getBlogs } from '@repo/actions/blogs.actions';

import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://manumaharani.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static routes
  const staticRoutes = [
    '',
    '/about-us',
    '/blogs',
    '/contact-us',
    '/fine-dining',
    '/junglesafari',
    '/junglesafari/book-safari',
    '/rooms',
    '/wedding',
  ].map((route) => ({
    changeFrequency: 'weekly' as const,
    lastModified: new Date(),
    priority: route === '' ? 1 : 0.8,
    url: `${BASE_URL}${route}`,
  }));

  // Dynamic routes (Blogs)
  const { blogs } = await getBlogs({ limit: 1000, status: 'published' });

  const blogRoutes = blogs.map((blog) => ({
    changeFrequency: 'weekly' as const,
    lastModified: new Date(blog.updated_at || blog.created_at || new Date()),
    priority: 0.6,
    url: `${BASE_URL}/blogs/${blog.slug}`,
  }));

  return [...staticRoutes, ...blogRoutes];
}
