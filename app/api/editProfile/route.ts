import { NextRequest, NextResponse } from 'next/server';
import updateUser from '@/lib/updateUser';

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
    const user = data;
    await updateUser(user);
    return NextResponse.json({ user: user }, { status: 200 });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
