'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const CACHE_KEY = 'exchange_rates_cache';
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours
const CURRENCY_KEY = 'selected_currency';

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$', EUR: '€', GBP: '£', CAD: 'CA$', AUD: 'A$',
};

export const SUPPORTED_CURRENCIES = Object.keys(CURRENCY_SYMBOLS);

type Rates = Record<string, number>;

type CurrencyContextType = {
  currency: string;
  setCurrency: (code: string) => void;
  format: (usdAmount: number | string) => string;
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState('USD');
  const [rates, setRates] = useState<Rates | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(CURRENCY_KEY);
    if (saved && SUPPORTED_CURRENCIES.includes(saved)) setCurrencyState(saved);
    setIsHydrated(true);

    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_EXPIRY) {
          setRates(data);
          return;
        }
      } catch (e) {
        console.error('Failed to parse cached exchange rates', e);
      }
    }

    fetch('/api/rates')
      .then(r => r.json())
      .then(result => {
        if (result?.rates) {
          setRates(result.rates);
          localStorage.setItem(CACHE_KEY, JSON.stringify({ data: result.rates, timestamp: Date.now() }));
        }
      })
      .catch(err => console.error('Failed to fetch exchange rates:', err));
  }, []);

  useEffect(() => {
    if (isHydrated) localStorage.setItem(CURRENCY_KEY, currency);
  }, [currency, isHydrated]);

  const setCurrency = useCallback((code: string) => {
    if (SUPPORTED_CURRENCIES.includes(code)) setCurrencyState(code);
  }, []);

  const format = useCallback((usdAmount: number | string) => {
    const usd = typeof usdAmount === 'string' ? parseFloat(usdAmount) : usdAmount;
    if (isNaN(usd)) return `${CURRENCY_SYMBOLS[currency] ?? '$'}0.00`;

    const symbol = CURRENCY_SYMBOLS[currency] ?? '$';
    const rate = currency === 'USD' ? 1 : rates?.[currency];
    if (!rate) return `$${usd.toFixed(2)}`;

    return `${symbol}${(usd * rate).toFixed(2)}`;
  }, [currency, rates]);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, format }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error('useCurrency must be used within a CurrencyProvider');
  return context;
}
