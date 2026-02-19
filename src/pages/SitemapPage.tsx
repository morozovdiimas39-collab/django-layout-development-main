import { useEffect } from 'react';

const SITEMAP_URL = 'https://functions.yandexcloud.net/d4e970s0n7por7g0cpc3';

export default function SitemapPage() {
  useEffect(() => {
    // Редиректим на функцию sitemap для получения актуального XML
    window.location.replace(SITEMAP_URL);
  }, []);

  return null;
}
