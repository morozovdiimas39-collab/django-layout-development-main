import type { Metadata } from 'next';
import HomePage from '@/pages/HomePage';

export const metadata: Metadata = {
  title: 'Школа актёрского и ораторского мастерства Казбека Меретукова в Москве',
  description: 'Профессиональное обучение актёрскому и ораторскому мастерству от режиссёра телесериалов Казбека Меретукова. Победитель ТЕФИ-2012. Курсы для взрослых и детей. Пробное занятие бесплатно.',
  alternates: { canonical: 'https://xn----7sbdfnbalzedv3az5aq.xn--p1ai/' },
  openGraph: {
    url: 'https://xn----7sbdfnbalzedv3az5aq.xn--p1ai/',
    title: 'Школа Казбека Меретукова - актёрское и ораторское мастерство',
    description: 'Профессиональное обучение от режиссёра телесериалов. Победитель ТЕФИ-2012. Курсы актёрского и ораторского мастерства в Москве.',
    type: 'website',
  },
};

export default function Page() {
  return <HomePage />;
}
