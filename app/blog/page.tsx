import type { Metadata } from 'next';
import { Suspense } from 'react';
import BlogPage from '@/pages/BlogPage';

const SITE_BASE = 'https://xn----7sbdfnbalzedv3az5aq.xn--p1ai';

export async function generateMetadata(props: { searchParams: Promise<{ page?: string }> }): Promise<Metadata> {
  const searchParams = await props.searchParams;
  const page = Math.max(1, parseInt(searchParams?.page || '1', 10) || 1);
  const pageTitle = page === 1
    ? 'Блог школы - Полезные материалы и новости | Школа актёрского мастерства'
    : `Блог — страница ${page} | Школа актёрского мастерства`;
  const description = page === 1
    ? 'Читайте полезные материалы, новости и истории успеха наших учеников. Советы по развитию ораторских навыков и актёрского мастерства.'
    : `Полезные материалы и новости школы актёрского мастерства. Страница ${page}.`;

  return {
    title: pageTitle,
    description,
    alternates: {
      canonical: page === 1 ? `${SITE_BASE}/blog` : `${SITE_BASE}/blog?page=${page}`,
    },
    openGraph: {
      url: page === 1 ? `${SITE_BASE}/blog` : `${SITE_BASE}/blog?page=${page}`,
      title: page === 1 ? 'Блог школы актёрского мастерства' : `Блог — страница ${page}`,
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
