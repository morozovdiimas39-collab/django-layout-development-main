import type { Metadata } from 'next';
import ReviewsPage from '@/pages/ReviewsPage';

export const metadata: Metadata = {
  title: 'Отзывы учеников | Школа актёрского и ораторского мастерства',
  description: 'Отзывы учеников о курсах актёрского и ораторского мастерства школы Казбека Меретукова.',
  alternates: { canonical: 'https://xn----7sbdfnbalzedv3az5aq.xn--p1ai/reviews' },
  openGraph: {
    url: 'https://xn----7sbdfnbalzedv3az5aq.xn--p1ai/reviews',
    title: 'Отзывы учеников — школа Казбека Меретукова',
    description: 'Реальные отзывы о курсах актёрского и ораторского мастерства. Что говорят выпускники школы.',
    type: 'website',
  },
};

export default function Page() {
  return <ReviewsPage />;
}
