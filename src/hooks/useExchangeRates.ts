'use client';

import { useState, useEffect } from 'react';

const CACHE_KEY = 'exchange_rates_cache';
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

interface ExchangeRates {
  EUR: number;
  GBP: number;
  [key: string]: number;
}

export function useExchangeRates() {
  const [rates, setRates] = useState<ExchangeRates | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < CACHE_EXPIRY) {
            setRates(data);
            setLoading(false);
            return;
          }
        }

        const response = await fetch('/api/rates');
        const result = await response.json();
        
        if (result && result.rates) {
          const ratesData = {
            EUR: result.rates.EUR,
            GBP: result.rates.GBP,
          };
          setRates(ratesData);
          localStorage.setItem(CACHE_KEY, JSON.stringify({
            data: ratesData,
            timestamp: Date.now()
          }));
        } else {
          throw new Error('Invalid rate data');
        }
      } catch (error) {
        console.error('Failed to fetch exchange rates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
  }, []);

  const formatPrice = (usdPrice: number | string) => {
    const price = typeof usdPrice === 'string' ? parseFloat(usdPrice) : usdPrice;
    if (isNaN(price)) return { usd: '$0.00', eur: '€0.00', gbp: '£0.00' };

    return {
      usd: `$${price.toFixed(2)}`,
      eur: rates ? `€${(price * rates.EUR).toFixed(2)}` : '...',
      gbp: rates ? `£${(price * rates.GBP).toFixed(2)}` : '...'
    };
  };

  return { rates, loading, formatPrice };
}
