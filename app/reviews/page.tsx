import type { Metadata } from 'next';
import ReviewsPage from '@/pages/ReviewsPage';

export const metadata: Metadata = {
  title: 'Отзывы учеников',
  description: 'Отзывы о курсах актёрского и ораторского мастерства школы Казбека Меретукова.',
  alternates: { canonical: 'https://kazbek-meretukov.ru/reviews' },
  openGraph: {
    url: 'https://kazbek-meretukov.ru/reviews',
    title: 'Отзывы учеников — школа Казбека Меретукова',
    description: 'Реальные отзывы о курсах актёрского и ораторского мастерства. Что говорят выпускники школы.',
    type: 'website',
  },
};

export default function Page() {
  return <ReviewsPage />;
}
