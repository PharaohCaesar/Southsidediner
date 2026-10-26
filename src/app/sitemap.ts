import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return ['', '/menu', '/story', '/jobs', '/contact'].map((p) => ({
    url: `${SITE.url}${p}`,
    lastModified: now,
    changeFrequency: p === '/menu' ? 'weekly' : 'monthly',
    priority: p === '' ? 1 : 0.7,
  }));
}
