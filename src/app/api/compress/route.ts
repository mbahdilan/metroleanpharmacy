import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const apiKey = process.env.TINIFY_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Tinify API key not configured' }, { status: 500 });
    }

    const auth = Buffer.from(`api:${apiKey}`).toString('base64');

    // 1. Upload to Tinify for compression
    const shrinkResponse = await fetch('https://api.tinify.com/shrink', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
      },
      body: file,
    });

    if (!shrinkResponse.ok) {
      const errorData = await shrinkResponse.json();
      return NextResponse.json({ error: errorData.message || 'Compression failed' }, { status: shrinkResponse.status });
    }

    const shrinkData = await shrinkResponse.json();
    const compressedUrl = shrinkData.output.url;

    // 2. Fetch the compressed image
    const compressedImageResponse = await fetch(compressedUrl);
    const compressedBuffer = await compressedImageResponse.arrayBuffer();

    return new NextResponse(compressedBuffer, {
      headers: {
        'Content-Type': file.type,
      },
    });
  } catch (error: any) {
    console.error('Compression API error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
