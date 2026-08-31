import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const defaultInvoiceSettings = {
  companyName: 'ELARA SILVER',
  tagline: 'Fine 925 Sterling Silver Jewellery',
  logoUrl: '/images/footerlogo.PNG',
  websiteUrl: 'www.elarasilver.com',
  supportEmail: 'support@elarasilver.com',
  gstin: '',
  pan: '',
  currencySymbol: 'INR',
  showStatusBadge: false,
  showPan: false,
  showGstin: false,
  termsText: '• Goods once sold can be returned within 7 days per return policy.\n• Pure 925 Sterling Silver certified products.',
  signatoryText: 'ELARA SILVER AUTHORIZED SIGNATORY',
  signatorySubtext: ''
};

export async function GET() {
  try {
    const setting = await prisma.setting.findUnique({
      where: { key: 'invoice_settings' }
    });
    
    if (!setting) {
      return NextResponse.json({ success: true, data: defaultInvoiceSettings });
    }
    
    return NextResponse.json({ success: true, data: { ...defaultInvoiceSettings, ...(setting.value as any) } });
  } catch (error) {
    console.error('Error fetching invoice settings:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch invoice settings' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    
    const setting = await prisma.setting.upsert({
      where: { key: 'invoice_settings' },
      update: { value: body },
      create: {
        key: 'invoice_settings',
        value: body
      }
    });
    
    return NextResponse.json({ success: true, data: setting.value });
  } catch (error) {
    console.error('Error updating invoice settings:', error);
    return NextResponse.json({ success: false, error: 'Failed to update invoice settings' }, { status: 500 });
  }
}
