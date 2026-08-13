export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function GET() {
  try {
    const result = await cloudinary.search
      .expression('folder:elara_uploads')
      .sort_by('created_at', 'desc')
      .max_results(500)
      .execute();
      
    const images = result.resources.map((file: any) => ({
      name: file.public_id,
      url: file.secure_url,
      size: file.bytes,
      createdAt: file.created_at
    }));

    return NextResponse.json({ success: true, images });
  } catch (error) {
    console.error('Error reading images from Cloudinary:', error);
    return NextResponse.json({ success: false, error: 'Failed to read images' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');
    
    if (!filename) {
      return NextResponse.json({ success: false, error: 'Filename is required' }, { status: 400 });
    }

    await cloudinary.uploader.destroy(filename);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete image' }, { status: 500 });
  }
}
