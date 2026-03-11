import type { Metadata } from 'next';
import ActingShowreelPage from '@/pages/ActingShowreelPage';

export const metadata: Metadata = {
  title: 'Актерская визитка | Профессиональная видеовизитка для актеров от режиссера Казбека Меретукова',
  description: 'Создание профессиональной актерской визитки (showreel) под руководством режиссера-постановщика. Качественная съемка, монтаж, продюсирование. Ваш пропуск в кино и театр.',
  alternates: { canonical: 'https://xn----7sbdfnbalzedv3az5aq.xn--p1ai/showreel' },
  openGraph: {
    url: 'https://xn----7sbdfnbalzedv3az5aq.xn--p1ai/showreel',
    title: 'Актерская визитка | Профессиональная видеовизитка',
    type: 'website',
  },
};

export default function Page() {
  return <ActingShowreelPage />;
}
