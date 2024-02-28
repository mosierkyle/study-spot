import { NextRequest, NextResponse } from 'next/server';
import { getSpot } from '@/lib/getSpot';

async function streamToString(stream: any) {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString('utf8');
}

type ResponseData = {
  message: string;
};
export async function POST(
  req: Request | NextRequest,
  res: NextResponse<ResponseData>
) {
  try {
    const data = JSON.parse(await streamToString(req.body));
    const spotId = data;
    const spot = await getSpot(spotId);
    return NextResponse.json({ spot: spot }, { status: 200 });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
