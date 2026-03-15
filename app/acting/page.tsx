import type { Metadata } from 'next';
import ActingPage from '@/pages/ActingPage';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Курсы актёрского мастерства в Москве от режиссёра Казбека Меретукова | Актёрская школа',
  description: 'Профессиональные курсы актёрского мастерства от режиссёра телесериалов. Победитель ТЕФИ-2012. Обучение актёрскому мастерству, работа на камеру, съёмка короткометражного фильма. Пробное занятие бесплатно.',
  alternates: { canonical: 'https://xn----7sbdfnbalzedv3az5aq.xn--p1ai/acting' },
  openGraph: {
    url: 'https://xn----7sbdfnbalzedv3az5aq.xn--p1ai/acting',
    title: 'Курсы актёрского мастерства в Москве от режиссёра Казбека Меретукова',
    description: 'Профессиональные курсы актёрского мастерства от режиссёра телесериалов. Обучение актёрскому мастерству, работа на камеру.',
    type: 'website',
  },
};

export default function Page() {
  return <ActingPage />;
}
