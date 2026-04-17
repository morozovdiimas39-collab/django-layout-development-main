import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BlogPostPage from '@/pages/BlogPostPage';
import { API_URLS, type BlogPost } from '@/lib/api';
import { stripHtmlForDescription } from '@/lib/blog-content';

const SITE_BASE = 'https://kazbek-meretukov.ru';

function normalizeSlug(value: string): string {
  return decodeURIComponent(value).trim().replace(/^\/+|\/+$/g, '').toLowerCase();
}

function pickPostFromUnknown(payload: unknown): BlogPost | null {
  if (Array.isArray(payload) && payload[0]) return payload[0] as BlogPost;
  if (payload && typeof payload === 'object') {
    const obj = payload as Record<string, unknown>;
    if (Array.isArray(obj.items) && obj.items[0]) return obj.items[0] as BlogPost;
    if (typeof obj.title === 'string' && (typeof obj.slug === 'string' || typeof obj.id === 'number')) {
      return obj as BlogPost;
    }
  }
  return null;
}

async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const normalized = normalizeSlug(slug);
  const idMatch = normalized.match(/^id-(\d+)$/) || normalized.match(/^(\d+)$/);
  const forcedId = idMatch ? Number(idMatch[1]) : null;
  try {
    const response = await fetch(`${API_URLS.gallery}?resource=blog&slug=${encodeURIComponent(slug)}`, {
      next: { revalidate: 60 },
    });
    if (response.ok) {
      const direct = pickPostFromUnknown(await response.json());
      if (direct) return direct;
    }
  } catch {
    // fallback below
  }

  // Fallback for APIs where direct slug filter is unstable or differently encoded.
  try {
    const response = await fetch(`${API_URLS.gallery}?resource=blog&page=1&per_page=200`, {
      next: { revalidate: 60 },
    });
    if (!response.ok) return null;
    const data = await response.json();
    const items = Array.isArray((data as { items?: unknown[] })?.items)
      ? ((data as { items: unknown[] }).items as BlogPost[])
      : (Array.isArray(data) ? (data as BlogPost[]) : []);

    return (
      (forcedId ? items.find((item) => Number(item.id) === forcedId) : null) ||
      items.find((item) => item.slug && normalizeSlug(item.slug) === normalized) ||
      null
    );
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { slug } = params;
  const post = await getBlogPost(slug);
  if (!post) {
    return {
      title: { absolute: 'Статья не найдена' },
      description: 'Такой записи в блоге нет. Откройте раздел «Блог» или главную страницу.',
      robots: { index: false, follow: false },
    };
  }
  /** Заголовок для поиска и вкладки (может отличаться от H1 на странице) */
  const metaTitle = post.seo_title?.trim() || post.title;
  const rawDesc =
    post.seo_description?.trim() ||
    post.excerpt?.trim() ||
    stripHtmlForDescription(post.content || '', 200);
  const trimmed = rawDesc.trim();
  const clipped = trimmed.length > 155 ? `${trimmed.slice(0, 152)}…` : trimmed;
  const description =
    clipped ||
    `Статья «${metaTitle}» — блог школы Казбека Меретукова.`.slice(0, 160);
  const url = `${SITE_BASE}/blog/${post.slug || slug}`;
  const ogImage = post.image_url || post.cover_image_url;

  return {
    title: `${metaTitle} | Блог`,
    description,
    alternates: { canonical: url },
    openGraph: {
      url,
      title: metaTitle,
      description,
      type: 'article',
      locale: 'ru_RU',
      siteName: 'Школа Казбека Меретукова',
      images: ogImage ? [{ url: ogImage, alt: post.title }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
    robots: { index: true, follow: true },
  };
}

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const articleUrl = `${SITE_BASE}/blog/${post.slug || slug}`;
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Главная',
        item: `${SITE_BASE}/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Блог',
        item: `${SITE_BASE}/blog`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: articleUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <BlogPostPage slug={slug} initialPost={post} />
    </>
  );
}
