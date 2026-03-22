import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import Providers from '@/components/Providers';

export const metadata: Metadata = {
  title: 'Курсы актёрского мастерства в Москве от режиссёра Казбека Меретукова | Актёрская школа',
  description: 'Профессиональные курсы актёрского мастерства от режиссёра телесериалов. Победитель ТЕФИ-2012. Обучение актёрскому мастерству, работа на камеру, съёмка короткометражного фильма. Пробное занятие бесплатно.',
  metadataBase: new URL('https://xn----7sbdfnbalzedv3az5aq.xn--p1ai'),
  verification: {
    google: 'BtRs8O8Q13Po4g2b28dZWMlMHxbLAvBgZnbcGzdQsHg',
    yandex: '7ed7aae3cee9983e',
  },
  openGraph: {
    title: 'Курсы актёрского мастерства от режиссёра Казбека Меретукова',
    description: 'Профессиональное обучение актёрскому мастерству. Работа на камеру, съёмка фильма, пробное занятие бесплатно.',
    type: 'website',
    url: 'https://xn----7sbdfnbalzedv3az5aq.xn--p1ai',
  },
  robots: { index: true, follow: true },
  icons: {
    icon: '/favicon.svg',
  },
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
        <noscript>
          <div>
            <img
              src="https://mc.yandex.ru/watch/104854671"
              style={{ position: 'absolute', left: '-9999px' }}
              alt=""
            />
          </div>
        </noscript>
        <Script
          id="yandex-metrika"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(m,e,t,r,i,k,a){
                m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                m[i].l=1*new Date();
                for (var j = 0; j < document.scripts.length; j++) { if (document.scripts[j].src === r) { return; } }
                k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a);
              })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js?id=104854671', 'ym');
              ym(104854671, 'init', { ssr: true, webvisor: true, clickmap: true, ecommerce: 'dataLayer', accurateTrackBounce: true, trackLinks: true });
            `,
          }}
        />
      </body>
    </html>
  );
}
