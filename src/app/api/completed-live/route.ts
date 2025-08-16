
import { NextResponse } from 'next/server';

const API_URLS = [
    'https://automation9thphp.vercel.app/api/api.php?token=my_secret_key_123&view=completed',
    'https://php-pearl.vercel.app/api/api?token=my_secret_key_123&view=completed'
];

export async function GET() {
  try {
    const responses = await Promise.all(
        API_URLS.map(url => fetch(url, { cache: 'no-store' }).then(res => res.json()))
    );

    const combinedData = responses.flatMap(response => response.data || []);
    
    const uniqueData = Array.from(new Map(combinedData.map(item => [item.id, item])).values());

    return NextResponse.json({ status: true, message: "Completed classes fetched", data: uniqueData });

  } catch (error) {
    let errorMessage = 'An unknown error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ status: false, message: 'Error fetching completed live data', error: errorMessage }, { status: 500 });
  }
}
