import type { Metadata } from 'next';
import Script from 'next/script';
import { Inter, Montserrat } from 'next/font/google';
import './globals.css';
import Providers from '@/components/Providers';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  weight: ['300', '400', '500', '600'],
  display: 'swap',
  variable: '--font-inter',
  adjustFontFallback: true,
});

const montserrat = Montserrat({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-montserrat',
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  title: {
    default: 'Школа Казбека Меретукова — актёрское и ораторское мастерство, Москва',
    template: '%s | Казбек Меретуков',
  },
  description:
    'Курсы актёрского и ораторского мастерства в Москве. Режиссёр телесериалов, ТЕФИ-2012. Пробное занятие бесплатно.',
  metadataBase: new URL('https://kazbek-meretukov.ru'),
  verification: {
    google: 'BtRs8O8Q13Po4g2b28dZWMlMHxbLAvBgZnbcGzdQsHg',
    yandex: '7ed7aae3cee9983e',
  },
  openGraph: {
    title: 'Школа Казбека Меретукова — актёрское мастерство',
    description: 'Обучение актёрскому и ораторскому мастерству в Москве. Пробное занятие бесплатно.',
    type: 'website',
    url: 'https://kazbek-meretukov.ru',
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml', sizes: 'any' },
      { url: '/favicon.ico', sizes: '48x48' },
    ],
    apple: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={`${inter.variable} ${montserrat.variable}`}>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" sizes="any" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        {/* Логотип в шапке — реальный ранний запрос; API Yandex Cloud грузится после гидрации, preconnect к нему даёт «неиспользуемое подключение» в PSI */}
        <link rel="preconnect" href="https://i.1.creatium.io" />
        <link rel="dns-prefetch" href="https://maps.yastatic.net" />
        <link rel="dns-prefetch" href="https://mc.yandex.ru" />
        <link rel="dns-prefetch" href="https://top-fwz1.mail.ru" />
      </head>
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
        <noscript>
          <div>
            <img
              src="https://top-fwz1.mail.ru/counter?id=3753615;js=na"
              style={{ position: 'absolute', left: '-9999px' }}
              alt="Top.Mail.Ru"
            />
          </div>
        </noscript>
        <Script
          id="top-mail-ru-counter"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
var _tmr = window._tmr || (window._tmr = []);
_tmr.push({id: "3753615", type: "pageView", start: (new Date()).getTime()});
(function (d, w, id) {
  if (d.getElementById(id)) return;
  var ts = d.createElement("script"); ts.type = "text/javascript"; ts.async = true; ts.id = id;
  ts.src = "https://top-fwz1.mail.ru/js/code.js";
  var f = function () {var s = d.getElementsByTagName("script")[0]; s.parentNode.insertBefore(ts, s);};
  if (w.opera == "[object Opera]") { d.addEventListener("DOMContentLoaded", f, false); } else { f(); }
})(document, window, "tmr-code");
            `.trim(),
          }}
        />
        <Script
          id="yandex-metrika"
          strategy="lazyOnload"
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
