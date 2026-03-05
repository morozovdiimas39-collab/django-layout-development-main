import { useEffect } from 'react';

const SITEMAP_URL = import.meta.env.VITE_SITEMAP_URL;

export default function SitemapRedirect() {
  useEffect(() => {
    if (SITEMAP_URL) {
      window.location.replace(SITEMAP_URL);
    }
  }, []);
  return null;
}
