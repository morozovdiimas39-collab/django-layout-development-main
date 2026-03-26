import type { MetadataRoute } from 'next';

const BASE = 'https://kazbek-meretukov.ru';
const GALLERY_URL = process.env.GALLERY_URL || 'https://functions.yandexcloud.net/d4efvkeujnc7nmk8at71';

const staticRoutes: MetadataRoute.Sitemap = [
  { url: BASE, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
  { url: `${BASE}/acting`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
  { url: `${BASE}/oratory`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
  { url: `${BASE}/realtors`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
  { url: `${BASE}/acting-cards`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
  { url: `${BASE}/teacher`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
  { url: `${BASE}/team`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  { url: `${BASE}/reviews`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
  { url: `${BASE}/contacts`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  { url: `${BASE}/showreel`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  { url: `${BASE}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
  { url: `${BASE}/subscribe`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
];

async function fetchBlogSlugs(): Promise<{ slug: string; updated_at?: string }[]> {
  const slugs: { slug: string; updated_at?: string }[] = [];
  let page = 1;
  let totalPages = 1;
  const perPage = 100;
  try {
    do {
      const res = await fetch(`${GALLERY_URL}?resource=blog&page=${page}&per_page=${perPage}`, {
        next: { revalidate: 3600 },
      });
      if (!res.ok) break;
      const data = await res.json();
      const items = data.items || [];
      totalPages = data.total_pages || 1;
      for (const item of items) {
        if (item.slug) slugs.push({ slug: item.slug, updated_at: item.updated_at || item.created_at });
      }
      page++;
    } while (page <= totalPages);
  } catch {
    // fallback: only static + /blog
  }
  return slugs;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogSlugs = await fetchBlogSlugs();
  const blogEntries: MetadataRoute.Sitemap = blogSlugs.map(({ slug, updated_at }) => ({
    url: `${BASE}/blog/${slug}`,
    lastModified: updated_at ? new Date(updated_at) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));
  return [...staticRoutes, ...blogEntries];
}
