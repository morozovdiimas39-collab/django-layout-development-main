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

async function generateSitemap() {
  try {
    // Получаем XML напрямую из функции sitemap
    const response = await fetch('https://functions.yandexcloud.net/d4e970s0n7por7g0cpc3');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const xml = await response.text();
    
    const publicDir = join(__dirname, '..', 'public');
    const sitemapPath = join(publicDir, 'sitemap.xml');
    
    writeFileSync(sitemapPath, xml, 'utf-8');
    console.log(`✅ Sitemap generated from function`);
  } catch (error) {
    console.error('Error fetching sitemap from function:', error);
    // Fallback: генерируем статический sitemap без статей блога
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages.map(page => `  <url>
    <loc>${baseUrl}${page.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    const publicDir = join(__dirname, '..', 'public');
    const sitemapPath = join(publicDir, 'sitemap.xml');
    
    writeFileSync(sitemapPath, xml, 'utf-8');
    console.log(`⚠️  Sitemap generated without blog posts (fallback)`);
  }
}

generateSitemap();
