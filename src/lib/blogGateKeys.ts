// Generated via `node generate_blog_gate_keys.mjs`. These are one-way (scrypt)
// hashes — safe to commit; the plaintext passcodes cannot be recovered from them.
// Either entry grants access (the second is the recovery passcode). Rotate by
// re-running that script with new passphrases, which overwrites this file — do
// that if either passcode leaks.
export const BLOG_GATE_KEYS: { salt: string; hash: string }[] = [
  { salt: '05270ee46c3a6f28ae88ac822a859150', hash: '05f1ebd2de414fad52d17eb3a44a83fb0f8fdc67f169a15ad73e23072310bf2d964c100c397c3e2b1e3f468f4bfcfc9af32643f6c6eb3d6fd03df3029b3ac751' },
  { salt: 'b64b9209e041aee2bf20fef6da5e210f', hash: 'a097bf965e87a3aa0a170a7fd784aae99cbf1882476480c6dcd4862a16d8cf8cb7e46e16f4622893085b152d731b9303bdb0c6405f05fa4029c0d0ad17278d5a' },
];
