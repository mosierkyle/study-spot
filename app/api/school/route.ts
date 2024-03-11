import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getSchool } from '@/lib/getSchool';
import { School, User } from '@prisma/client';
import { getUser } from '@/lib/getUser';

async function streamToString(stream: any) {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString('utf8');
}

type ResponseData = {
  school: School;
  user?: User;
};
export async function POST(
  req: Request | NextRequest,
  res: NextResponse<ResponseData>
) {
  try {
    let user: User | undefined;
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;
    if (userEmail) {
      user = await getUser(userEmail);
    }
    const data = JSON.parse(await streamToString(req.body));
    const schoolId = data;
    const school = await getSchool(schoolId);
    return NextResponse.json({ school: school, user: user }, { status: 200 });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
