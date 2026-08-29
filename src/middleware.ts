import { NextRequest, NextResponse } from 'next/server';
import { BLOG_GATE_COOKIE_NAME, verifySessionToken } from '@/lib/blogGateSession';

export const config = {
  matcher: ['/admin/blog/:path*', '/api/blog/:path*'],
};

export async function middleware(request: NextRequest) {
  const token = request.cookies.get(BLOG_GATE_COOKIE_NAME)?.value;
  const valid = await verifySessionToken(token);

  if (valid) return NextResponse.next();

  if (request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.json({ error: 'Blog passcode required' }, { status: 401 });
  }

  const url = request.nextUrl.clone();
  url.pathname = '/admin';
  url.search = '?blogGate=required';
  return NextResponse.redirect(url);
}
