import { NextRequest, NextResponse } from 'next/server';
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY ?? '',
  },
});

async function deleteFileFromS3(key: any): Promise<any> {
  try {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
    };

    const command = new DeleteObjectCommand(params);
    const response = await s3Client.send(command);

    return response;
  } catch (error) {
    console.error('Error deleting file from S3:', error);
    throw error;
  }
}

async function streamToString(stream: any) {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString('utf8');
}

const extractPathFromUrl = (url: string) => {
  const startIndex = url.indexOf('.com/') + 5;
  return url.substring(startIndex);
};

export async function POST(
  req: Request | NextRequest,
  res: Response | NextResponse
) {
  try {
    console.log(`we here mf`);
    const prevPhoto = JSON.parse(await streamToString(req.body));
    const key = extractPathFromUrl(prevPhoto);
    console.log(`---${key}`);
    const response = await deleteFileFromS3(key);

    return NextResponse.json({ response }, { status: 200 });
  } catch (error) {
    console.error('Error handling file upload:', error);
    return NextResponse.json(
      { error: 'Failed to handle file upload' },
      { status: 500 }
    );
  }
}
