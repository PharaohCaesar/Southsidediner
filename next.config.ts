import path from 'node:path';
import type { NextConfig } from 'next';

const securityHeaders = [
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
];

const nextConfig: NextConfig = {
  // Pin the root so Turbopack never walks up into a parent folder's lockfile (Dropbox layout).
  turbopack: { root: path.join(__dirname) },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [{ protocol: 'https', hostname: '**.supabase.co' }],
  },
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }];
  },
  async redirects() {
    return [
      // Old Webflow URLs.
      { source: '/reservation', destination: '/contact', permanent: true },
      { source: '/gallery', destination: '/story', permanent: true },
      // Template leftovers Google still has indexed (sitemap.xml on the old site).
      { source: '/blog/:path*', destination: '/story', permanent: true },
      { source: '/parties', destination: '/contact', permanent: true },
      { source: '/template-information/:path*', destination: '/', permanent: true },
    ];
  },
};

export default nextConfig;
