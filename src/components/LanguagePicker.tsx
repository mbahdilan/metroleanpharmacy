'use client';

import { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';

const LANGUAGES = [
  { code: 'en', flagCode: 'us', phrase: 'Continue in English'       },
  { code: 'fr', flagCode: 'fr', phrase: 'Continue en français'      },
  { code: 'de', flagCode: 'de', phrase: 'Weiter auf Deutsch'        },
  { code: 'it', flagCode: 'it', phrase: 'Continua in italiano'      },
  { code: 'es', flagCode: 'es', phrase: 'Continuar en español'      },
  { code: 'ru', flagCode: 'ru', phrase: 'Продолжить на русском'     },
  { code: 'sq', flagCode: 'al', phrase: 'Vazhdo në shqip'           },
];

const COUNTRY_TO_LANG: Record<string, string> = {
  FR: 'fr', BE: 'fr', CH: 'fr', MC: 'fr', LU: 'fr',
  CI: 'fr', SN: 'fr', ML: 'fr', BF: 'fr', NE: 'fr', TG: 'fr',
  BJ: 'fr', GN: 'fr', CD: 'fr', CG: 'fr', CM: 'fr', GA: 'fr',
  MG: 'fr', DZ: 'fr', MA: 'fr', TN: 'fr',
  DE: 'de', AT: 'de',
  IT: 'it', SM: 'it', VA: 'it',
  ES: 'es', MX: 'es', AR: 'es', CO: 'es', CL: 'es', PE: 'es',
  VE: 'es', EC: 'es', GT: 'es', CU: 'es', BO: 'es', DO: 'es',
  HN: 'es', PY: 'es', SV: 'es', NI: 'es', CR: 'es', PA: 'es',
  UY: 'es', GQ: 'es',
  RU: 'ru', BY: 'ru', KZ: 'ru',
  AL: 'sq', XK: 'sq',
};

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const m = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return m ? decodeURIComponent(m[2]) : null;
}

function getActiveLang(): string {
  const cookie = getCookie('googtrans');
  if (!cookie) return 'en';
  return cookie.split('/')[2] || 'en';
}

export default function LanguagePicker() {
  const [isOpen, setIsOpen]           = useState(false);
  const [suggested, setSuggested]     = useState<string | null>(null);
  const [activeLang, setActiveLang]   = useState('en');
  const [mounted, setMounted]         = useState(false);

  useEffect(() => {
    setMounted(true);
    setActiveLang(getActiveLang());

    // Only show picker automatically on the very first session visit
    if (getCookie('googtrans') || sessionStorage.getItem('lang-picker-shown')) return;
    sessionStorage.setItem('lang-picker-shown', '1');

    fetch('https://ipapi.co/country/')
      .then(r => r.text())
      .then(cc => {
        const lang = COUNTRY_TO_LANG[cc.trim().toUpperCase()];
        if (lang) setSuggested(lang);
        setIsOpen(true);
      })
      .catch(() => setIsOpen(true));
  }, []);

  const selectLanguage = useCallback((code: string) => {
    setActiveLang(code);
    setIsOpen(false);

    if (code === 'en') {
      document.cookie = 'googtrans=; path=/; max-age=0';
      document.cookie = `googtrans=; path=/; domain=.${window.location.hostname}; max-age=0`;
    } else {
      document.cookie = `googtrans=/en/${code}; path=/`;
      document.cookie = `googtrans=/en/${code}; path=/; domain=.${window.location.hostname}`;
    }

    window.location.reload();
  }, []);

  const current = LANGUAGES.find(l => l.code === activeLang) ?? LANGUAGES[0];

  return (
    <>
      {/* ── Navbar trigger button ───────────────────── */}
      <button
        onClick={() => setIsOpen(true)}
        className="lang-trigger"
        aria-label="Change language"
      >
        <img
          src={`https://flagcdn.com/w40/${current.flagCode}.png`}
          alt={current.code}
          className="lang-trigger-flag-img"
          width={20}
          height={15}
        />
        <span className="lang-trigger-name">{current.code.toUpperCase()}</span>
        <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor" style={{ opacity: 0.5 }}>
          <path d="M0 2l4 4 4-4z" />
        </svg>
      </button>

      {/* ── Language picker modal (portaled to body to escape navbar transform) ── */}
      {mounted && isOpen && createPortal(
        <div
          className="lang-overlay"
          onClick={() => setIsOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Language selector"
        >
          <div
            className="lang-modal"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="lang-modal-header">
              <div className="lang-modal-globe">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              </div>
              <h2 className="lang-modal-title">Choose Your Language</h2>
              {suggested && suggested !== 'en' && (
                <p className="lang-modal-sub">
                  We detected your location —&nbsp;
                  <strong style={{ color: '#00d2ff' }}>
                    {LANGUAGES.find(l => l.code === suggested)?.phrase}
                  </strong>
                  &nbsp;is highlighted for you.
                </p>
              )}
            </div>

            {/* Close button */}
            <button className="lang-modal-close" onClick={() => setIsOpen(false)} aria-label="Close">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>

            {/* Language grid */}
            <div className="lang-grid">
              {LANGUAGES.map(lang => (
                <button
                  key={lang.code}
                  className={[
                    'lang-card',
                    lang.code === activeLang  ? 'lang-card--active'    : '',
                    lang.code === suggested   ? 'lang-card--suggested' : '',
                  ].filter(Boolean).join(' ')}
                  onClick={() => selectLanguage(lang.code)}
                >
                  {lang.code === suggested && (
                    <span className="lang-card-badge">Suggested</span>
                  )}
                  {lang.code === activeLang && (
                    <span className="lang-card-check">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    </span>
                  )}
                  <img
                    src={`https://flagcdn.com/w80/${lang.flagCode}.png`}
                    alt={lang.code}
                    className="lang-card-flag-img"
                    width={56}
                    height={42}
                  />
                  <span className="lang-card-phrase">{lang.phrase}</span>
                </button>
              ))}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
