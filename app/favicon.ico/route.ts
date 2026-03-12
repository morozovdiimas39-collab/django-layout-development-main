import { NextResponse } from 'next/server';

export function GET(request: Request) {
  const url = new URL(request.url);
  const origin = url.origin;
  return NextResponse.redirect(`${origin}/favicon.svg`, 302);
}
