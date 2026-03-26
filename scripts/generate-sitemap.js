import { writeFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const BASE_URL = 'https://kazbek-meretukov.ru';
const GALLERY_URL = process.env.GALLERY_URL || 'https://functions.yandexcloud.net/d4efvkeujnc7nmk8at71';
const today = new Date().toISOString().split('T')[0];

const staticPages = [
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
  { loc: '/subscribe', priority: '0.5', changefreq: 'monthly' },
];

function escapeXml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function urlNode(loc, priority, changefreq, lastmod = today) {
  const locEsc = escapeXml(BASE_URL + loc);
  return `  <url>
    <loc>${locEsc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

function getFallbackXml() {
  const urls = [
    ...staticPages.map((p) => urlNode(p.loc, p.priority, p.changefreq)),
    urlNode('/blog', '0.8', 'weekly'),
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;
}

async function fetchAllBlogSlugs() {
  const slugs = [];
  let page = 1;
  let totalPages = 1;
  const perPage = 100;
  do {
    const url = `${GALLERY_URL}?resource=blog&page=${page}&per_page=${perPage}`;
    const res = await fetch(url);
    if (!res.ok) return { slugs: [], totalPages: 1 };
    const data = await res.json();
    const items = data.items || [];
    totalPages = data.total_pages || 1;
    for (const item of items) {
      if (item.slug) slugs.push({ slug: item.slug, updated_at: item.updated_at || item.created_at });
    }
    page++;
  } while (page <= totalPages);
  return { slugs, totalPages };
}

function buildXml(blogSlugs) {
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ];
  for (const p of staticPages) {
    lines.push(urlNode(p.loc, p.priority, p.changefreq));
  }
  lines.push(urlNode('/blog', '0.8', 'weekly'));
  for (const { slug, updated_at } of blogSlugs) {
    const lastmod = updated_at ? String(updated_at).slice(0, 10) : today;
    lines.push(urlNode(`/blog/${slug}`, '0.7', 'monthly', lastmod));
  }
  lines.push('</urlset>');
  return lines.join('\n');
}

async function generateSitemap() {
  const publicDir = join(__dirname, '..', 'public');
  const sitemapPath = join(publicDir, 'sitemap.xml');
  let xml;

  try {
    const { slugs } = await fetchAllBlogSlugs();
    xml = buildXml(slugs);
    console.log('✅ Sitemap built: static + /blog +', slugs.length, 'posts');
  } catch (e) {
    console.error('Build from API failed, using static fallback:', e.message);
    xml = getFallbackXml();
  }

  try {
    mkdirSync(publicDir, { recursive: true });
  } catch (_) {}
  writeFileSync(sitemapPath, xml, 'utf-8');
  console.log('✅ Written public/sitemap.xml');
}

generateSitemap();
