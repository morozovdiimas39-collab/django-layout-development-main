import { useEffect } from 'react';

const SITEMAP_URL = 'https://functions.yandexcloud.net/d4e970s0n7por7g0cpc3';

export default function SitemapPage() {
  useEffect(() => {
    // Делаем fetch к функции sitemap и заменяем содержимое страницы на XML
    fetch(SITEMAP_URL)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then(xml => {
        // Устанавливаем правильный Content-Type через meta tag
        const meta = document.createElement('meta');
        meta.httpEquiv = 'Content-Type';
        meta.content = 'application/xml; charset=utf-8';
        document.head.appendChild(meta);
        
        // Заменяем весь документ на XML
        document.open('text/xml');
        document.write(xml);
        document.close();
      })
      .catch(error => {
        console.error('Error fetching sitemap:', error);
        // Fallback: редирект на функцию напрямую
        window.location.href = SITEMAP_URL;
      });
  }, []);

  return null;
}
