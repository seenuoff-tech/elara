import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const imagesDir = path.join(process.cwd(), 'public', 'images');
    
    if (!fs.existsSync(imagesDir)) {
      return NextResponse.json({ success: true, images: [] });
    }

    const files = fs.readdirSync(imagesDir);
    
    const images = files.map(file => {
      const filePath = path.join(imagesDir, file);
      const stats = fs.statSync(filePath);
      
      // Only include files (skip directories like 'elara')
      if (stats.isDirectory()) return null;
      
      return {
        name: file,
        url: `/images/${file}`,
        size: stats.size,
        createdAt: stats.birthtime.toISOString()
      };
    }).filter(Boolean);

    return NextResponse.json({ success: true, images });
  } catch (error) {
    console.error('Error reading images directory:', error);
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

    // Basic security check to prevent directory traversal
    if (filename.includes('..') || filename.includes('/')) {
       return NextResponse.json({ success: false, error: 'Invalid filename' }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), 'public', 'images', filename);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, error: 'File not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete image' }, { status: 500 });
  }
}
