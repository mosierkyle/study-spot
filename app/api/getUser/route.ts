import getUser from '@/lib/getUser';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

type ResponseData = {
  message: string;
};

export async function GET(
  req: Request | NextRequest,
  res: NextResponse<ResponseData>
) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.email) {
      const user = await getUser(session?.user?.email);
      // console.log(user);
      return NextResponse.json({ user }, { status: 201 });
    } else {
      return NextResponse.json(
        { error: 'could not verify user' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
