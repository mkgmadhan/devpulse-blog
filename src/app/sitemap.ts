import { getAllPosts, getAllTags } from '@/lib/posts';
import type { MetadataRoute } from 'next';

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://devpulse.blog';

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const tags = getAllTags();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), priority: 1 },
    { url: `${BASE}/blog`, lastModified: new Date(), priority: 0.9 },
    { url: `${BASE}/topics`, lastModified: new Date(), priority: 0.7 },
    { url: `${BASE}/about`, lastModified: new Date(), priority: 0.5 },
  ];

  const postRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${BASE}/blog/${p.slug}`,
    lastModified: new Date(p.date),
    priority: 0.8,
  }));

  const tagRoutes: MetadataRoute.Sitemap = tags.map((tag) => ({
    url: `${BASE}/topics/${tag.toLowerCase()}`,
    lastModified: new Date(),
    priority: 0.6,
  }));

  return [...staticRoutes, ...postRoutes, ...tagRoutes];
}
