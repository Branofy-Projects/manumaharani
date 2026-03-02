import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const BASE_URL =
    process.env.NEXT_PUBLIC_APP_URL || 'https://manumaharani.com';

  return {
    rules: [
      {
        allow: '/',
        disallow: ['/api/', '/reels/'],
        userAgent: '*',
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
