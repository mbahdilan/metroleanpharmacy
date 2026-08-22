import { NextResponse } from 'next/server';

async function fetchPaidRates(apiKey: string) {
  const response = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`, {
    next: { revalidate: 3600 * 12 } // Cache for 12 hours at the edge/server level
  });
  const data = await response.json();

  if (data.result !== 'success') {
    throw new Error(data['error-type'] || 'Failed to fetch rates');
  }

  return {
    EUR: data.conversion_rates.EUR,
    GBP: data.conversion_rates.GBP,
    CAD: data.conversion_rates.CAD,
    AUD: data.conversion_rates.AUD,
  };
}

// ponytail: free, no-key-required ECB rates; ok to lag a few days over a long weekend
async function fetchFreeRates() {
  const response = await fetch('https://api.frankfurter.dev/v1/latest?base=USD&symbols=EUR,GBP,CAD,AUD', {
    next: { revalidate: 3600 * 12 }
  });
  const data = await response.json();

  if (!data.rates) {
    throw new Error('Failed to fetch rates');
  }

  return {
    EUR: data.rates.EUR,
    GBP: data.rates.GBP,
    CAD: data.rates.CAD,
    AUD: data.rates.AUD,
  };
}

export async function GET() {
  try {
    const apiKey = process.env.EXCHANGE_RATE_API_KEY;
    const rates = apiKey ? await fetchPaidRates(apiKey) : await fetchFreeRates();
    return NextResponse.json({ rates });
  } catch (error: any) {
    console.error('Exchange rate error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
