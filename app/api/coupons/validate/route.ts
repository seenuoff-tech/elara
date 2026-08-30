import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, subtotal } = body;

    if (!code || subtotal === undefined) {
      return NextResponse.json({ success: false, error: 'Missing code or subtotal' }, { status: 400 });
    }

    const coupon = await prisma.coupon.findUnique({ where: { code: code.toUpperCase() } });

    if (!coupon) {
      return NextResponse.json({ success: false, error: 'Invalid coupon code' }, { status: 400 });
    }

    if (coupon.status !== 'Active') {
      return NextResponse.json({ success: false, error: 'This coupon is no longer active' }, { status: 400 });
    }

    const now = new Date();
    if (now < coupon.startDate) {
      return NextResponse.json({ success: false, error: 'This coupon is not valid yet' }, { status: 400 });
    }

    if (now > coupon.endDate) {
      return NextResponse.json({ success: false, error: 'This coupon has expired' }, { status: 400 });
    }

    if (coupon.maxUses && coupon.currentUses >= coupon.maxUses) {
      return NextResponse.json({ success: false, error: 'This coupon has reached its usage limit' }, { status: 400 });
    }

    const subtotalValue = parseFloat(subtotal);
    let discountAmount = 0;

    if (coupon.discountType === 'percentage') {
      discountAmount = (subtotalValue * coupon.discountValue) / 100;
    } else if (coupon.discountType === 'flat') {
      discountAmount = coupon.discountValue;
    }

    // Ensure discount doesn't exceed subtotal
    if (discountAmount > subtotalValue) {
      discountAmount = subtotalValue;
    }

    return NextResponse.json({ 
      success: true, 
      discountAmount,
      couponCode: coupon.code,
      message: `Coupon applied successfully!`
    });

  } catch (error) {
    console.error('Error validating coupon:', error);
    return NextResponse.json({ success: false, error: 'Failed to validate coupon' }, { status: 500 });
  }
}
