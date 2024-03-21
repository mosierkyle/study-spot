import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: 'us-west-1',
  credentials: {
    accessKeyId: 'AKIA6GBMHXKL5L4KD2GL',
    secretAccessKey: '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',
  },
});

async function uploadFileToS3(file: any, fileName: string): Promise<string> {
  const fileBuffer = file;
  // console.log(fileName);

  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `avatar/${fileName}-${Date.now()}`,
    Body: fileBuffer,
    ContentType: 'image/jpg',
  };

  const command = new PutObjectCommand(params);
  await s3Client.send(command);
  const fileURL = `https://${params.Bucket}.s3.${'us-west-1'}.amazonaws.com/${
    params.Key
  }`;
  return fileURL;
}

export async function POST(
  req: Request | NextRequest,
  res: Response | NextResponse
) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file || typeof file !== 'object') {
      return NextResponse.json({ error: 'File is required' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileURL = await uploadFileToS3(buffer, file.name);
    return NextResponse.json({ fileURL }, { status: 200 });
  } catch (error) {
    console.error('Error handling file upload:', error);
    return NextResponse.json(
      { error: 'Failed to handle file upload' },
      { status: 500 }
    );
  }
}
