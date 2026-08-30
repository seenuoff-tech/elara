import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { orderNumber, email } = await request.json();

    if (!orderNumber || !email) {
      return NextResponse.json({ success: false, error: 'Order number and email are required.' }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: { items: true }
    });

    if (!order || order.email.toLowerCase() !== email.toLowerCase()) {
      return NextResponse.json({ success: false, error: 'No order found with the provided details.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    console.error('Error tracking order:', error);
    return NextResponse.json({ success: false, error: 'Failed to retrieve tracking information.' }, { status: 500 });
  }
}
