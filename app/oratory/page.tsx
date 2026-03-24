import type { Metadata } from 'next';
import OratoryPage from '@/pages/OratoryPage';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Курсы ораторского мастерства',
  description:
    'Уверенные публичные выступления, голос и дикция, работа со страхом сцены. Курсы в Москве.',
  alternates: { canonical: 'https://xn----7sbdfnbalzedv3az5aq.xn--p1ai/oratory' },
  openGraph: {
    url: 'https://xn----7sbdfnbalzedv3az5aq.xn--p1ai/oratory',
    title: 'Курсы ораторского мастерства',
    description:
      'Уверенные публичные выступления, голос и дикция, работа со страхом сцены. Курсы в Москве.',
    type: 'website',
  },
};

export default function Page() {
  return <OratoryPage />;
}
