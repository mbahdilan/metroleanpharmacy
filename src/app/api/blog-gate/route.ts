import { NextResponse } from 'next/server';
import { verifyPasscode } from '@/lib/blogGateCrypto';
import { BLOG_GATE_COOKIE_NAME, BLOG_GATE_SESSION_TTL_MS, createSessionToken } from '@/lib/blogGateSession';

// ponytail: in-memory rate limit, per server instance only — resets on cold start and
// doesn't share state across serverless instances. Good enough for a single-admin site;
// swap for a persistent store (e.g. Upstash) if this ever needs to hold up under real abuse.
const attempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

function tooManyAttempts(ip: string): boolean {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || now > entry.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_ATTEMPTS;
}

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';

  if (tooManyAttempts(ip)) {
    return NextResponse.json({ error: 'Too many attempts. Try again later.' }, { status: 429 });
  }

  const { passcode } = await request.json().catch(() => ({ passcode: '' }));
  if (typeof passcode !== 'string' || !verifyPasscode(passcode)) {
    return NextResponse.json({ error: 'Incorrect passcode' }, { status: 401 });
  }

  const token = await createSessionToken();
  const response = NextResponse.json({ success: true });
  response.cookies.set(BLOG_GATE_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: BLOG_GATE_SESSION_TTL_MS / 1000,
  });
  return response;
}
