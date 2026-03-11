import type { Metadata } from 'next';
import RealtorsPage from '@/pages/RealtorsPage';

export const metadata: Metadata = {
  title: 'Ораторское мастерство для риелторов | Курс в Москве',
  description: 'Курс ораторского мастерства для риелторов и агентов недвижимости. Презентации объектов, переговоры, холодные звонки. Обучение в Москве.',
  alternates: { canonical: 'https://xn----7sbdfnbalzedv3az5aq.xn--p1ai/realtors' },
  openGraph: {
    url: 'https://xn----7sbdfnbalzedv3az5aq.xn--p1ai/realtors',
    title: 'Ораторское мастерство для риелторов',
    type: 'website',
  },
};

export default function Page() {
  return <RealtorsPage />;
}
