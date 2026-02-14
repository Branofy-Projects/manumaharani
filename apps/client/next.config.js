/** @type {import('next').NextConfig} */
const nextConfig = {
 cacheComponents: true,
 images: {
  formats: ['image/avif', 'image/webp'],
  minimumCacheTTL: 60 * 60 * 24 * 30,
  remotePatterns: [
   {
    hostname: 'images.unsplash.com',
    protocol: 'https',
   },
   {
    hostname: 'plus.unsplash.com',
    protocol: 'https',
   },
   {
    hostname: 'ik.imagekit.io',
    protocol: 'https',
   },
   {
    hostname: 'www.manumaharaniresorts.com',
    protocol: 'https',
   },
   {
    hostname: 'storage.googleapis.com',
    protocol: 'https',
   },
   {
    hostname: 'thelibrary.mgmresorts.com',
    protocol: 'https',
   },
  ],
 },
 output: 'standalone',
};

export default nextConfig;
