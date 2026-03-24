import type { Metadata } from 'next';
import ActingCardsPage from '@/pages/ActingCardsPage';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Актёрская видеовизитка',
  description:
    'Съёмка актёрской визитки с режиссёром: подготовка, 4K, монтаж. Материал для кастингов в кино и сериалы.',
  alternates: { canonical: 'https://xn----7sbdfnbalzedv3az5aq.xn--p1ai/acting-cards' },
  openGraph: {
    url: 'https://xn----7sbdfnbalzedv3az5aq.xn--p1ai/acting-cards',
    title: 'Актёрская визитка — съёмка с режиссёром в Москве',
    description: 'Подготовка и съёмка актёрской визитки под руководством режиссёра Казбека Меретукова. 4K, монтаж, готовый материал для кастингов.',
    type: 'website',
  },
};

export default function Page() {
  return <ActingCardsPage />;
}
