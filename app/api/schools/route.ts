import { NextRequest, NextResponse } from 'next/server';
import { getSchools } from '@/lib/getSchools';

type ResponseData = {
  message: string;
};

export async function GET(
  req: Request | NextRequest,
  res: NextResponse<ResponseData>
) {
  try {
    const schools = await getSchools();
    return NextResponse.json({ schools: schools }, { status: 200 });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
