import type { Metadata } from 'next';
import ActingShowreelPage from '@/pages/ActingShowreelPage';

export const metadata: Metadata = {
  title: 'Актёрский шоурил',
  description:
    'Монтаж актёрского шоурила с режиссёрской поддержкой: подборка сцен, готовый материал для кастингов и агентств.',
  alternates: { canonical: 'https://kazbek-meretukov.ru/showreel' },
  openGraph: {
    url: 'https://kazbek-meretukov.ru/showreel',
    title: 'Актёрский шоурил — монтаж и создание с режиссёром',
    description: 'Профессиональный актёрский шоурил под руководством режиссёра Казбека Меретукова. Подборка сцен, монтаж, финальный материал для агентств.',
    type: 'website',
  },
};

export default function Page() {
  return <ActingShowreelPage />;
}
