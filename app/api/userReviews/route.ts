import { NextRequest, NextResponse } from 'next/server';
import getReviewsUser from '@/lib/getReviewsUser';

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
    const authorId = data;
    const reviews = await getReviewsUser(authorId);
    return NextResponse.json({ reviews: reviews }, { status: 200 });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
