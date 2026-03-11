import type { Metadata } from 'next';
import ReviewsPage from '@/pages/ReviewsPage';

export const metadata: Metadata = {
  title: 'Отзывы учеников | Школа актёрского и ораторского мастерства',
  description: 'Отзывы учеников о курсах актёрского и ораторского мастерства школы Казбека Меретукова.',
  alternates: { canonical: 'https://xn----7sbdfnbalzedv3az5aq.xn--p1ai/reviews' },
};

export default function Page() {
  return <ReviewsPage />;
}
