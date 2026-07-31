import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const faqs = await prisma.faq.findMany({
      orderBy: { createdAt: 'asc' }
    });
    return NextResponse.json({ success: true, faqs });
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch FAQs' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { key, question, answer } = body;
    
    if (!question || !answer || !key) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }
    
    const faq = await prisma.faq.create({
      data: { key, question, answer }
    });
    
    return NextResponse.json({ success: true, faq });
  } catch (error) {
    console.error('Error creating FAQ:', error);
    return NextResponse.json({ success: false, error: 'Failed to create FAQ' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });
    }
    
    await prisma.faq.delete({
      where: { id }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting FAQ:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete FAQ' }, { status: 500 });
  }
}
