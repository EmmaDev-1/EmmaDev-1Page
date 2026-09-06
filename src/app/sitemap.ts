import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

/** One page, so one entry — but a declared one, which the source site had not. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];
}
