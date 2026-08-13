export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Upload to Cloudinary using a stream
    const uploadResult: any = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'elara_uploads', resource_type: 'auto' },
        (error, result) => {
          if (error) reject(new Error(error.message || JSON.stringify(error)));
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    return NextResponse.json({ 
      success: true, 
      url: uploadResult.secure_url,
      filename: uploadResult.public_id 
    });
  } catch (error: any) {
    console.error('Error uploading image to Cloudinary:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to upload image. Please check Vercel environment variables.' }, { status: 500 });
  }
}
