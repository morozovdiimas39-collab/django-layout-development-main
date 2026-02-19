import { useEffect } from 'react';

const SITEMAP_URL = 'https://functions.yandexcloud.net/d4e970s0n7por7g0cpc3';

export default function SitemapPage() {
  useEffect(() => {
    // Сразу редиректим на функцию sitemap для правильной работы с поисковыми системами
    window.location.replace(SITEMAP_URL);
  }, []);

  return null;
}
