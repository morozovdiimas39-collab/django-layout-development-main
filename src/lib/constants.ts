export const SITE_URL = 'https://kazbek-meretukov.ru';

export const toAbsoluteUrl = (path: string): string => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const base = typeof window !== 'undefined' ? window.location.origin : SITE_URL;
  return path.startsWith('/') ? `${base}${path}` : `${base}/${path}`;
};
