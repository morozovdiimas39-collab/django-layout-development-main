import { readFileSync } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

/** Запросы к /favicon.ico: отдаём тот же SVG с 200 (редирект ломал отображение во многих браузерах). */
export const runtime = 'nodejs';

export function GET() {
  const svg = readFileSync(path.join(process.cwd(), 'public', 'favicon.svg'));
  return new NextResponse(svg, {
    status: 200,
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
