import type { Metadata } from 'next';
import { Suspense } from 'react';
import BlogPage from '@/pages/BlogPage';

const SITE_BASE = 'https://kazbek-meretukov.ru';

export async function generateMetadata(props: { searchParams?: { page?: string | string[] } }): Promise<Metadata> {
  const rawPage = Array.isArray(props.searchParams?.page)
    ? props.searchParams?.page[0]
    : props.searchParams?.page;
  const page = Math.max(1, parseInt(rawPage || '1', 10) || 1);

  if (page > 1) {
    return {
      title: `Блог, страница ${page}`,
      robots: { index: false, follow: true },
      alternates: { canonical: `${SITE_BASE}/blog` },
    };
  }

  const desc =
    'Материалы и новости школы: ораторика, актёрское мастерство, истории учеников.';
  return {
    title: 'Блог школы',
    description: desc,
    alternates: {
      canonical: `${SITE_BASE}/blog`,
    },
    openGraph: {
      url: `${SITE_BASE}/blog`,
      title: 'Блог школы',
      description: desc,
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
