import type { Metadata } from 'next';
import BlogPostPage from '@/pages/BlogPostPage';
import { API_URLS } from '@/lib/api';

const SITE_BASE = 'https://xn----7sbdfnbalzedv3az5aq.xn--p1ai';

async function getBlogPost(slug: string) {
  try {
    const response = await fetch(`${API_URLS.gallery}?resource=blog&slug=${encodeURIComponent(slug)}`, {
      next: { revalidate: 60 },
    });
    const data = await response.json();
    return Array.isArray(data) && data[0] ? data[0] : null;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) {
    return {
      title: 'Статья не найдена | Блог',
    };
  }
  const title = `${post.title} | Блог школы актёрского мастерства`;
  const description = post.excerpt || post.content?.substring(0, 160) || '';
  const url = `${SITE_BASE}/blog/${post.slug || slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      url,
      title: post.title,
      description,
      type: 'article',
      images: post.image_url || post.cover_image_url ? [post.image_url || post.cover_image_url] : undefined,
    },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <BlogPostPage slug={slug} />;
}
