import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { code, discountType, discountValue, startDate, endDate, status, maxUses } = body;
    
    // Check if another coupon has the same code
    if (code) {
      const existing = await prisma.coupon.findFirst({
        where: { code, NOT: { id: params.id } }
      });
      
      if (existing) {
        return NextResponse.json({ success: false, error: 'Coupon code already exists' }, { status: 400 });
      }
    }

    const coupon = await prisma.coupon.update({
      where: { id: params.id },
      data: {
        ...(code && { code: code.toUpperCase() }),
        ...(discountType && { discountType }),
        ...(discountValue !== undefined && { discountValue: parseFloat(discountValue) }),
        ...(startDate && { startDate: new Date(startDate) }),
        ...(endDate && { endDate: new Date(endDate) }),
        ...(status && { status }),
        ...(maxUses !== undefined && { maxUses: maxUses ? parseInt(maxUses) : null }),
      }
    });
    
    return NextResponse.json({ success: true, coupon });
  } catch (error) {
    console.error('Error updating coupon:', error);
    return NextResponse.json({ success: false, error: 'Failed to update coupon' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.coupon.delete({
      where: { id: params.id }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting coupon:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete coupon' }, { status: 500 });
  }
}
