import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const CANONICAL_HOST = 'xn----7sbdfnbalzedv3az5aq.xn--p1ai';
const CYRILLIC_HOST = 'казбек-меретуков.рф';

const TRACKING_PARAMS = new Set([
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term',
  'yclid', '_ym_uid', '_ym_d', '_ym_is_ad', 'fbclid', 'gclid',
]);

function hasOnlyTrackingParams(searchParams: URLSearchParams): boolean {
  if (searchParams.size === 0) return false;
  for (const key of searchParams.keys()) {
    if (!TRACKING_PARAMS.has(key.toLowerCase())) return false;
  }
  return true;
}

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';
  const pathname = request.nextUrl.pathname;
  const searchParams = request.nextUrl.searchParams;

  // Редирект со слеша в конце на без слеша (кроме корня /)
  if (pathname.length > 1 && pathname.endsWith('/')) {
    const targetUrl = new URL(request.url);
    targetUrl.pathname = pathname.slice(0, -1);
    return NextResponse.redirect(targetUrl, 301);
  }

  // Редирект URL с только рекламными/счётчиковыми параметрами на чистый путь
  if (hasOnlyTrackingParams(searchParams)) {
    const targetUrl = new URL(request.url);
    targetUrl.search = '';
    return NextResponse.redirect(targetUrl, 301);
  }

  // Редирект www на без www
  if (host.startsWith('www.')) {
    const targetHost = host.replace(/^www\./, '');
    const targetUrl = new URL(request.url);
    targetUrl.host = targetHost;
    return NextResponse.redirect(targetUrl, 301);
  }

  // Редирект кириллического домена на основное зеркало (punycode)
  if (host === CYRILLIC_HOST) {
    const targetUrl = new URL(request.nextUrl.pathname + request.nextUrl.search, `https://${CANONICAL_HOST}`);
    return NextResponse.redirect(targetUrl, 301);
  }

  return NextResponse.next();
}
