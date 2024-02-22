import { SignedPostPolicyV4Output } from '@google-cloud/storage';
import { Storage } from '@google-cloud/storage';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

export async function POST(
  req: Request | NextRequest,
  res: Response | NextResponse
) {
  try {
    const formData = await req.formData();
    const photos = Array.from(formData.values());

    if (!process.env.GOOGLE_PRIVATE_KEY) {
      throw new Error('Google private key not found.');
    }

    const privateKey = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n');

    const storage = new Storage({
      projectId: 'studyspot-412317',
      credentials: {
        client_email: 'studyspot@studyspot-412317.iam.gserviceaccount.com',
        private_key: privateKey,
      },
    });

    const signedUrls = [];

    const options = {
      version: 'v4',
      action: 'write',
      expires: Date.now() + 15 * 60 * 1000,
    } as any;

    for (let i = 0; i < photos.length; i++) {
      try {
        const photo = photos[i] as File;
        const [signedUrl] = await storage
          .bucket('studyspot')
          .file(photo.name)
          .getSignedUrl(options);
        console.log('Signed URL for', photo.name, ':', signedUrl);

        signedUrls.push(signedUrl);
      } catch (error) {
        console.error('Error generating signed URL: ', error);
        // Handle the error as needed
      }
    }

    return NextResponse.json({ signedUrls }, { status: 200 });
  } catch (error) {
    console.error('Error generating signed URLs:', error);
    return NextResponse.json(
      { error: 'Failed to generate signed URLs' },
      { status: 500 }
    );
  }
}
