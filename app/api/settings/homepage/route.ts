import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const setting = await prisma.setting.findUnique({
      where: { key: 'homepage_sections' }
    });
    
    if (!setting) {
      return NextResponse.json({ success: true, data: null });
    }
    
    return NextResponse.json({ success: true, data: setting.value });
  } catch (error) {
    console.error('Error fetching homepage settings:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    
    const setting = await prisma.setting.upsert({
      where: { key: 'homepage_sections' },
      update: { value: body },
      create: {
        key: 'homepage_sections',
        value: body
      }
    });
    
    return NextResponse.json({ success: true, data: setting.value });
  } catch (error) {
    console.error('Error updating homepage settings:', error);
    return NextResponse.json({ success: false, error: 'Failed to update settings' }, { status: 500 });
  }
}
