import type { Metadata } from 'next';
import ActingPage from '@/pages/ActingPage';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Курс актёрского мастерства в Москве — обучение у режиссёра телесериалов',
  description: 'Курс актёрского мастерства от режиссёра Казбека Меретукова (ТЕФИ-2012): работа на камеру, съёмка короткометражного фильма, самопробы для кастингов. Пробное занятие бесплатно.',
  alternates: { canonical: 'https://xn----7sbdfnbalzedv3az5aq.xn--p1ai/acting' },
  openGraph: {
    url: 'https://xn----7sbdfnbalzedv3az5aq.xn--p1ai/acting',
    title: 'Курс актёрского мастерства — режиссёр Казбек Меретуков',
    description: 'Работа на камеру, съёмка фильма, самопробы для кастингов. Режиссёр телесериалов, победитель ТЕФИ-2012.',
    type: 'website',
  },
};

export default function Page() {
  return <ActingPage />;
}
