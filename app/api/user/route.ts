import type { NextApiRequest, NextApiResponse } from 'next';
import createUser from '@/lib/createUser';
import { NextResponse } from 'next/server';

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
  req: NextApiRequest | Request,
  res: NextApiResponse<ResponseData>
) {
  const data = JSON.parse(await streamToString(req.body));
  const { name, email, password } = data;
  try {
    const user = await createUser({ email, name, password });
    console.log(user);
    return NextResponse.json(
      { error: 'User has been created' },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: 'User could not be created' },
      { status: 500 }
    );
  }
}
