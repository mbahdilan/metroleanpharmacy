import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiKey = process.env.EXCHANGE_RATE_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const response = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`, {
      next: { revalidate: 3600 * 12 } // Cache for 12 hours at the edge/server level
    });
    
    const data = await response.json();
    
    if (data.result === 'success') {
      return NextResponse.json({
        rates: {
          EUR: data.conversion_rates.EUR,
          GBP: data.conversion_rates.GBP,
        }
      });
    } else {
      throw new Error(data['error-type'] || 'Failed to fetch rates');
    }
  } catch (error: any) {
    console.error('Exchange rate error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
