import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const baseUrl = 'https://xn----7sbdfnbalzedv3az5aq.xn--p1ai';
const today = new Date().toISOString().split('T')[0];

const staticPages = [
  { loc: '/', priority: '1.0', changefreq: 'weekly' },
  { loc: '/acting', priority: '0.9', changefreq: 'weekly' },
  { loc: '/oratory', priority: '0.9', changefreq: 'weekly' },
  { loc: '/acting-cards', priority: '0.9', changefreq: 'weekly' },
  { loc: '/teacher', priority: '0.8', changefreq: 'monthly' },
  { loc: '/team', priority: '0.7', changefreq: 'monthly' },
  { loc: '/reviews', priority: '0.7', changefreq: 'weekly' },
  { loc: '/blog', priority: '0.8', changefreq: 'weekly' },
  { loc: '/contacts', priority: '0.6', changefreq: 'monthly' },
  { loc: '/showreel', priority: '0.7', changefreq: 'monthly' },
];

function getFallbackXml() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages.map(page => `  <url>
    <loc>${baseUrl}${page.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
}

async function generateSitemap() {
  const distDir = join(__dirname, '..', 'dist');
  const sitemapPath = join(distDir, 'sitemap.xml');
  let xml;
  try {
    const response = await fetch('https://functions.yandexcloud.net/d4e970s0n7por7g0cpc3');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    xml = await response.text();
    console.log('✅ Sitemap from function');
  } catch (error) {
    console.error('Sitemap fetch failed, using static:', error.message);
    xml = getFallbackXml();
  }
  const { mkdirSync } = await import('fs');
  try { mkdirSync(distDir, { recursive: true }); } catch (_) {}
  writeFileSync(sitemapPath, xml, 'utf-8');
  console.log('✅ Written dist/sitemap.xml');
}

generateSitemap();
