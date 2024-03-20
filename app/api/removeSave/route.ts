import removeSave from '@/lib/removeSave';
import { NextRequest, NextResponse } from 'next/server';

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
  const data = JSON.parse(await streamToString(req.body));
  const { studentId, studySpotId } = data;
  try {
    await removeSave({ studentId, studySpotId });
    return NextResponse.json(
      { error: 'Save has been deleted' },
      { status: 201 }
    );
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
