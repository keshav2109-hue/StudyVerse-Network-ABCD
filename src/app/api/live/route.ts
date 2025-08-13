import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://livedatanexttopper.vercel.app/api/live/eleak', {
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
    return NextResponse.json({ message: 'Error fetching live data', error: errorMessage }, { status: 500 });
  }
}
