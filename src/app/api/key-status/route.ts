
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://eduverseapi.vercel.app/eduverse/api/keyonoff', {
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
    // Default to true (key required) in case of an error to maintain security
    return NextResponse.json({ on: true, error: errorMessage }, { status: 500 });
  }
}
