import type { Metadata } from 'next';
import RealtorsPage from '@/pages/RealtorsPage';

export const metadata: Metadata = {
  title: 'Ораторское мастерство для риелторов',
  description:
    'Курс для риелторов: презентации объектов, переговоры, холодные звонки. Москва.',
  alternates: { canonical: 'https://kazbek-meretukov.ru/realtors' },
  openGraph: {
    url: 'https://kazbek-meretukov.ru/realtors',
    title: 'Ораторское мастерство для риелторов',
    description:
      'Курс для риелторов: презентации объектов, переговоры, холодные звонки. Москва.',
    type: 'website',
  },
};

export default function Page() {
  return <RealtorsPage />;
}
