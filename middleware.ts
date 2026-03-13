import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const CANONICAL_HOST = 'xn----7sbdfnbalzedv3az5aq.xn--p1ai';
const CYRILLIC_HOST = 'казбек-меретуков.рф';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';

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
