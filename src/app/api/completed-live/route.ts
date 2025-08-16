
import { NextResponse } from 'next/server';

const PEARL_API_URL = 'https://php-pearl.vercel.app/api/api?token=my_secret_key_123&view=completed';
const AUTOMATION_API_URL = 'https://automation9thphp.vercel.app/api/api.php?token=my_secret_key_123&view=completed';

export async function GET() {
  try {
    const [pearlResponse, automationResponse] = await Promise.all([
        fetch(PEARL_API_URL, { cache: 'no-store' }).then(res => res.json()),
        fetch(AUTOMATION_API_URL, { cache: 'no-store' }).then(res => res.json())
    ]);

    const pearlData = (pearlResponse.data || []).slice(0, 2);
    const automationData = (automationResponse.data || []).slice(0, 2);

    const combinedData = [...pearlData, ...automationData];
    
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
