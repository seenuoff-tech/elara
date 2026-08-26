import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, orderId, customerData, total } = body;

    // Update stock for each item
    for (const item of items) {
      if (item.id) {
        // Decrease stock
        await prisma.product.update({
          where: { id: item.id },
          data: {
            stock: {
              decrement: item.quantity
            }
          }
        });
      }
    }

    // Since we don't have an Order model, we just return success after stock update
    return NextResponse.json({ success: true, message: 'Stock updated' });
  } catch (error: any) {
    console.error('Error during checkout:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
