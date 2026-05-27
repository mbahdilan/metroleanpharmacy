'use client';

import { useEffect } from 'react';

// Maps ISO 3166-1 alpha-2 country codes to GTranslate language codes
const COUNTRY_TO_LANG: Record<string, string> = {
  // French
  FR: 'fr', BE: 'fr', CH: 'fr', MC: 'fr', LU: 'fr',
  CI: 'fr', SN: 'fr', ML: 'fr', BF: 'fr', NE: 'fr',
  TG: 'fr', BJ: 'fr', GN: 'fr', CD: 'fr', CG: 'fr',
  CM: 'fr', GA: 'fr', MG: 'fr', DZ: 'fr', MA: 'fr', TN: 'fr',
  // German
  DE: 'de', AT: 'de',
  // Italian
  IT: 'it', SM: 'it', VA: 'it',
  // Spanish
  ES: 'es', MX: 'es', AR: 'es', CO: 'es', CL: 'es', PE: 'es',
  VE: 'es', EC: 'es', GT: 'es', CU: 'es', BO: 'es', DO: 'es',
  HN: 'es', PY: 'es', SV: 'es', NI: 'es', CR: 'es', PA: 'es',
  UY: 'es', GQ: 'es',
  // Russian
  RU: 'ru', BY: 'ru', KZ: 'ru',
  // Albanian
  AL: 'sq', XK: 'sq',
};

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

export default function GeoTranslate() {
  useEffect(() => {
    // If googtrans cookie exists, user already has a language set (manual or previous geo-detect).
    // Respect it — don't override.
    if (getCookie('googtrans')) return;

    // Only attempt geo-detection once per browser session to avoid hammering the API
    if (sessionStorage.getItem('geo-detect-done')) return;
    sessionStorage.setItem('geo-detect-done', '1');

    // ipapi.co returns just the 2-letter country code as plain text (free, no key needed)
    fetch('https://ipapi.co/country/')
      .then(r => r.text())
      .then(countryCode => {
        const lang = COUNTRY_TO_LANG[countryCode.trim().toUpperCase()];
        if (!lang) return; // Country maps to English (default) — nothing to do

        // Poll until the GTranslate widget has initialised (up to ~5 seconds)
        let attempts = 0;
        const tryTranslate = setInterval(() => {
          attempts++;
          if (typeof (window as any).doGTranslate === 'function') {
            clearInterval(tryTranslate);
            (window as any).doGTranslate(`en|${lang}`);
          } else if (attempts >= 10) {
            clearInterval(tryTranslate);
            // Fallback: set the cookie directly and reload so GTranslate picks it up on next load
            document.cookie = `googtrans=/en/${lang}; path=/; max-age=31536000; SameSite=Lax`;
            window.location.reload();
          }
        }, 500);
      })
      .catch(() => {
        // Silently fail — the site stays in English if the IP API is unreachable
      });
  }, []);

  return null;
}
