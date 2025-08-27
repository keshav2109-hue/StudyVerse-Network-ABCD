import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://theeduverse-api.vercel.app/eduverse/api/onoroff', {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch from external API: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    let errorMessage = 'An unknown error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    // Return a default "off" state in case of an error
    return NextResponse.json({ on: false, error: errorMessage }, { status: 500 });
  }
}
