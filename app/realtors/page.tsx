import type { Metadata } from 'next';
import RealtorsPage from '@/pages/RealtorsPage';

export const metadata: Metadata = {
  title: 'Ораторское мастерство для риелторов',
  description:
    'Курс для риелторов: презентации объектов, переговоры, холодные звонки. Москва.',
  alternates: { canonical: 'https://xn----7sbdfnbalzedv3az5aq.xn--p1ai/realtors' },
  openGraph: {
    url: 'https://xn----7sbdfnbalzedv3az5aq.xn--p1ai/realtors',
    title: 'Ораторское мастерство для риелторов',
    description:
      'Курс для риелторов: презентации объектов, переговоры, холодные звонки. Москва.',
    type: 'website',
  },
};

export default function Page() {
  return <RealtorsPage />;
}
