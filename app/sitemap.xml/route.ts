import { NextResponse } from 'next/server';

const BASE = 'https://xn----7sbdfnbalzedv3az5aq.xn--p1ai';
const GALLERY_URL = process.env.GALLERY_URL || 'https://functions.yandexcloud.net/d4efvkeujnc7nmk8at71';

const staticPages: { loc: string; priority: string; changefreq: string }[] = [
  { loc: '/', priority: '1.0', changefreq: 'weekly' },
  { loc: '/acting', priority: '0.9', changefreq: 'weekly' },
  { loc: '/oratory', priority: '0.9', changefreq: 'weekly' },
  { loc: '/realtors', priority: '0.8', changefreq: 'monthly' },
  { loc: '/acting-cards', priority: '0.9', changefreq: 'weekly' },
  { loc: '/teacher', priority: '0.8', changefreq: 'monthly' },
  { loc: '/team', priority: '0.7', changefreq: 'monthly' },
  { loc: '/reviews', priority: '0.7', changefreq: 'weekly' },
  { loc: '/contacts', priority: '0.6', changefreq: 'monthly' },
  { loc: '/showreel', priority: '0.7', changefreq: 'monthly' },
  { loc: '/blog', priority: '0.8', changefreq: 'weekly' },
];

function escapeXml(s: string) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function urlNode(loc: string, priority: string, changefreq: string, lastmod: string) {
  const locEsc = escapeXml(BASE + loc);
  return `  <url>
    <loc>${locEsc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

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
    // fallback
  }
  return slugs;
}

export async function GET() {
  const today = new Date().toISOString().split('T')[0];
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ];

  for (const p of staticPages) {
    lines.push(urlNode(p.loc, p.priority, p.changefreq, today));
  }

  const blogSlugs = await fetchBlogSlugs();
  for (const { slug, updated_at } of blogSlugs) {
    const lastmod = updated_at ? String(updated_at).slice(0, 10) : today;
    lines.push(urlNode(`/blog/${slug}`, '0.7', 'monthly', lastmod));
  }

  lines.push('</urlset>');
  const xml = lines.join('\n');

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
