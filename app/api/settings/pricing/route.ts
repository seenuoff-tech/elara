import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const settings = await prisma.setting.findUnique({
      where: { key: 'pricing_rules' }
    });
    
    if (!settings) {
      // Return defaults if none exist
      return NextResponse.json({ 
        success: true, 
        data: {
          silverRates: {
            'Rings': 85,
            'Necklace': 85,
            'Bracelet': 85,
            'Earings': 85,
            'Anklets': 85,
            'Chains': 85,
            'Toe rings': 85,
            'Mens-Rings': 85,
            'Mens-Chains': 85,
            'Mens-Bracelet': 85,
            'Kids-Earings': 85,
          },
          gstPercentage: 3
        } 
      });
    }

    return NextResponse.json({ success: true, data: settings.value });
  } catch (error) {
    console.error('Error fetching pricing settings:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch settings', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { silverRates, gstPercentage } = body;

    const updated = await prisma.setting.upsert({
      where: { key: 'pricing_rules' },
      update: {
        value: { silverRates, gstPercentage }
      },
      create: {
        key: 'pricing_rules',
        value: { silverRates, gstPercentage }
      }
    });

    return NextResponse.json({ success: true, data: updated.value });
  } catch (error) {
    console.error('Error updating pricing settings:', error);
    return NextResponse.json({ success: false, error: 'Failed to update settings', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
