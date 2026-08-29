// Passcode hashing/verification for the blog admin gate. Node-only (scrypt isn't
// part of Web Crypto), so this must only be imported from Node-runtime code — the
// /api/blog-gate route, never middleware and never a 'use client' component.
import { scryptSync, randomBytes, timingSafeEqual } from 'crypto';
import { BLOG_GATE_KEYS } from './blogGateKeys';

const KEY_LENGTH = 64;

export function hashPasscode(passcode: string): { salt: string; hash: string } {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(passcode, salt, KEY_LENGTH).toString('hex');
  return { salt, hash };
}

function matchesHash(passcode: string, salt: string, hash: string): boolean {
  const candidate = scryptSync(passcode, salt, KEY_LENGTH);
  const expected = Buffer.from(hash, 'hex');
  if (candidate.length !== expected.length) return false;
  return timingSafeEqual(candidate, expected);
}

export function verifyPasscode(passcode: string): boolean {
  return BLOG_GATE_KEYS.some((k) => matchesHash(passcode, k.salt, k.hash));
}
