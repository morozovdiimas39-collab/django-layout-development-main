import type { Metadata } from 'next';
import './globals.css';
import Providers from '@/components/Providers';

export const metadata: Metadata = {
  title: 'Курсы актёрского мастерства в Москве от режиссёра Казбека Меретукова | Актёрская школа',
  description: 'Профессиональные курсы актёрского мастерства от режиссёра телесериалов. Победитель ТЕФИ-2012. Обучение актёрскому мастерству, работа на камеру, съёмка короткометражного фильма. Пробное занятие бесплатно.',
  metadataBase: new URL('https://xn----7sbdfnbalzedv3az5aq.xn--p1ai'),
  openGraph: {
    title: 'Курсы актёрского мастерства от режиссёра Казбека Меретукова',
    description: 'Профессиональное обучение актёрскому мастерству. Работа на камеру, съёмка фильма, пробное занятие бесплатно.',
    type: 'website',
    url: '/',
  },
  robots: 'index, follow',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
