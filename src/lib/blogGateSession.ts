// Signs/verifies the short-lived session cookie issued after a correct blog-gate
// passcode. Uses Web Crypto (`crypto.subtle`) rather than Node's `crypto` module so
// this same code runs unmodified in both the Node API route and Edge middleware.
// This file only ever signs a timestamp — it never touches the passcode itself.

export const BLOG_GATE_COOKIE_NAME = 'blog_gate_session';
export const BLOG_GATE_SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

function bufToHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function sign(message: string): Promise<string> {
  const secret = process.env.BLOG_GATE_SESSION_SECRET;
  if (!secret) throw new Error('BLOG_GATE_SESSION_SECRET is not set');
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message));
  return bufToHex(sig);
}

export async function createSessionToken(): Promise<string> {
  const issuedAt = Date.now().toString();
  return `${issuedAt}.${await sign(issuedAt)}`;
}

export async function verifySessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const [issuedAt, signature] = token.split('.');
  if (!issuedAt || !signature) return false;
  if (Date.now() - Number(issuedAt) > BLOG_GATE_SESSION_TTL_MS) return false;
  const expected = await sign(issuedAt);
  return timingSafeEqualHex(expected, signature);
}
