import { NextRequest, NextResponse } from 'next/server';
import { getSpot } from '@/lib/getSpot';
import { updateRating } from '@/lib/updateRating';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getUser } from '@/lib/getUser';
import { use } from 'react';
import { StudySpot, User } from '@prisma/client';

async function streamToString(stream: any) {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString('utf8');
}

type ResponseData = {
  spot: StudySpot;
  user?: User;
};
export async function POST(
  req: Request | NextRequest,
  res: NextResponse<ResponseData>
) {
  try {
    let user: User | undefined;
    const session = await getServerSession(authOptions);
    if (session) {
      user = await getUser(session?.user?.email ?? '');
    }
    const data = JSON.parse(await streamToString(req.body));
    const spotId = data;
    await updateRating(spotId);
    const spot = await getSpot(spotId);
    return NextResponse.json({ spot: spot, user: user }, { status: 200 });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
