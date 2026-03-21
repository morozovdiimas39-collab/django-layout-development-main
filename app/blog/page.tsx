import type { Metadata } from 'next';
import { Suspense } from 'react';
import BlogPage from '@/pages/BlogPage';

const SITE_BASE = 'https://xn----7sbdfnbalzedv3az5aq.xn--p1ai';

export async function generateMetadata(props: { searchParams?: { page?: string | string[] } }): Promise<Metadata> {
  const rawPage = Array.isArray(props.searchParams?.page)
    ? props.searchParams?.page[0]
    : props.searchParams?.page;
  const page = Math.max(1, parseInt(rawPage || '1', 10) || 1);

  if (page > 1) {
    return {
      title: `Блог — страница ${page} | Школа актёрского мастерства`,
      robots: { index: false, follow: true },
    };
  }

  return {
    title: 'Блог школы — полезные материалы и новости | Школа актёрского мастерства',
    description: 'Читайте полезные материалы, новости и истории успеха наших учеников. Советы по развитию ораторских навыков и актёрского мастерства.',
    alternates: {
      canonical: `${SITE_BASE}/blog`,
    },
    openGraph: {
      url: `${SITE_BASE}/blog`,
      title: 'Блог школы актёрского мастерства',
      description: 'Полезные материалы, новости и истории успеха учеников школы Казбека Меретукова.',
      type: 'website',
    },
  };
}

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Загрузка...</div>}>
      <BlogPage />
    </Suspense>
  );
}
