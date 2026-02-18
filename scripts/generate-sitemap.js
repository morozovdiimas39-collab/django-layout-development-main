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

async function fetchBlogPosts() {
  try {
    const response = await fetch('https://functions.yandexcloud.net/d4e970s0n7por7g0cpc3');
    const posts = await response.json();
    return posts.map(post => ({
      loc: `/blog/${post.slug}`,
      priority: '0.7',
      changefreq: 'monthly',
      lastmod: post.updated_at ? post.updated_at.split('T')[0] : today
    }));
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

async function generateSitemap() {
  const blogPosts = await fetchBlogPosts();
  
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages.map(page => `  <url>
    <loc>${baseUrl}${page.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
${blogPosts.map(post => `  <url>
    <loc>${baseUrl}${post.loc}</loc>
    <lastmod>${post.lastmod}</lastmod>
    <changefreq>${post.changefreq}</changefreq>
    <priority>${post.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  const publicDir = join(__dirname, '..', 'public');
  const sitemapPath = join(publicDir, 'sitemap.xml');
  
  writeFileSync(sitemapPath, xml, 'utf-8');
  console.log(`✅ Sitemap generated: ${blogPosts.length} blog posts + ${staticPages.length} static pages`);
}

generateSitemap();
