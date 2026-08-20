export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const id = parseInt(params.id);
    const body = await request.json();
    
    if (isNaN(id)) {
      return NextResponse.json({ success: false, error: 'Invalid ID' }, { status: 400 });
    }
    
    const updatedSlide = await prisma.slide.update({
      where: { id },
      data: {
        title: body.title,
        subtitle: body.subtitle,
        image: body.image,
        mobileImage: body.mobileImage,
        buttonText: body.buttonText,
        link: body.link,
        status: body.status
      }
    });
    
    return NextResponse.json({ success: true, slide: updatedSlide });
  } catch (error) {
    console.error('Error updating slide:', error);
    return NextResponse.json({ success: false, error: 'Failed to update slide' }, { status: 500 });
  }
}

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json({ success: false, error: 'Invalid ID' }, { status: 400 });
    }
    
    await prisma.slide.delete({
      where: { id }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting slide:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete slide' }, { status: 500 });
  }
}
