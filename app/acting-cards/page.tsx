import type { Metadata } from 'next';
import ActingCardsPage from '@/pages/ActingCardsPage';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Актёрская визитка — съёмка с режиссёром в Москве | Казбек Меретуков',
  description: 'Профессиональная съёмка актёрской видеовизитки: подготовка с режиссёром, 4K-съёмка, монтаж. Пропуск на кастинги в кино и сериалы. Ближайшие даты съёмок.',
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
