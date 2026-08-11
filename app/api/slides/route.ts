import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const slides = await prisma.slide.findMany({
      orderBy: { id: 'asc' }
    });
    return NextResponse.json({ success: true, slides });
  } catch (error) {
    console.error('Error fetching slides:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch slides' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, subtitle, image, buttonText, link, status } = body;
    
    if (!image) {
      return NextResponse.json({ success: false, error: 'Image is required' }, { status: 400 });
    }
    
    const newSlide = await prisma.slide.create({
      data: {
        title,
        subtitle,
        image,
        buttonText,
        link,
        status: status || 'Active'
      }
    });
    
    return NextResponse.json({ success: true, slide: newSlide });
  } catch (error) {
    console.error('Error creating slide:', error);
    return NextResponse.json({ success: false, error: 'Failed to create slide' }, { status: 500 });
  }
}
