import type { Metadata } from 'next';
import ActingShowreelPage from '@/pages/ActingShowreelPage';

export const metadata: Metadata = {
  title: 'Актёрский шоурил — монтаж и создание в Москве | Казбек Меретуков',
  description: 'Создание актёрского шоурила: подборка лучших работ, профессиональный монтаж, режиссёрская поддержка. Готовый шоурил для кастингов, агентств и продюсеров.',
  alternates: { canonical: 'https://xn----7sbdfnbalzedv3az5aq.xn--p1ai/showreel' },
  openGraph: {
    url: 'https://xn----7sbdfnbalzedv3az5aq.xn--p1ai/showreel',
    title: 'Актёрский шоурил — монтаж и создание с режиссёром',
    description: 'Профессиональный актёрский шоурил под руководством режиссёра Казбека Меретукова. Подборка сцен, монтаж, финальный материал для агентств.',
    type: 'website',
  },
};

export default function Page() {
  return <ActingShowreelPage />;
}
