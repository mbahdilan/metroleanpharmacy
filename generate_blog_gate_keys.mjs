// (Re)generates src/lib/blogGateKeys.ts — the two committed passcode hashes that
// gate /admin/blog. Run this to rotate either passcode (e.g. if one leaks):
//   node generate_blog_gate_keys.mjs "<primary passphrase>" "<recovery passphrase>"
//
// Passphrases should be long and random (20+ chars) — this file is committed to
// git, so a weak passcode is brute-forceable offline against the public hash.
// The hash itself is one-way (scrypt); committing it does not expose the passcode.

import { scryptSync, randomBytes } from 'crypto';
import { writeFileSync } from 'fs';

const [primary, recovery] = process.argv.slice(2);
if (!primary || !recovery) {
  console.error('Usage: node generate_blog_gate_keys.mjs "<primary passphrase>" "<recovery passphrase>"');
  process.exit(1);
}
for (const [label, phrase] of [['primary', primary], ['recovery', recovery]]) {
  if (phrase.length < 12) {
    console.error(`${label} passphrase is too short (${phrase.length} chars) — use at least 12, ideally 20+ random characters.`);
    process.exit(1);
  }
}

function hash(passcode) {
  const salt = randomBytes(16).toString('hex');
  const hashHex = scryptSync(passcode, salt, 64).toString('hex');
  return { salt, hash: hashHex };
}

const primaryKey = hash(primary);
const recoveryKey = hash(recovery);

const header = [
  '// Generated via `node generate_blog_gate_keys.mjs`. These are one-way (scrypt)',
  '// hashes — safe to commit; the plaintext passcodes cannot be recovered from them.',
  '// Either entry grants access (the second is the recovery passcode). Rotate by',
  '// re-running that script with new passphrases, which overwrites this file — do',
  '// that if either passcode leaks.',
].join('\n');

const content = `${header}
export const BLOG_GATE_KEYS: { salt: string; hash: string }[] = [
  { salt: '${primaryKey.salt}', hash: '${primaryKey.hash}' },
  { salt: '${recoveryKey.salt}', hash: '${recoveryKey.hash}' },
];
`;

writeFileSync(new URL('./src/lib/blogGateKeys.ts', import.meta.url), content);
console.log('Wrote src/lib/blogGateKeys.ts with new passcode hashes.');
