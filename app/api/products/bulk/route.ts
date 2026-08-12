import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { products } = body;
    
    if (!products || !Array.isArray(products)) {
      return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
    }

    const categories = await prisma.category.findMany();

    const formattedProducts = products.map((p: any) => {
      // Find categoryId by name
      const cat = categories.find(c => c.name.toLowerCase() === (p.category || '').toLowerCase());
      const catId = cat ? cat.id : categories[0]?.id; // fallback to first category if not found

      return {
        id: p.id || undefined,
        name: p.name,
        categoryId: catId,
        price: p.price ? parseFloat(p.price) : 0,
        stock: p.stock || 0,
        status: p.status || 'Active',
        image: p.image || null,
        gallery: p.gallery || null,
        description: p.description ? JSON.stringify(p.description) : null,
        isNew: !!p.isNew,
        weightInGrams: p.weightInGrams ? parseFloat(p.weightInGrams) : 0
      };
    });
    
    await prisma.product.createMany({
      data: formattedProducts,
      skipDuplicates: true
    });
    
    return NextResponse.json({ success: true, count: formattedProducts.length });
  } catch (error) {
    console.error('Error creating bulk products:', error);
    return NextResponse.json({ success: false, error: 'Failed to bulk create products' }, { status: 500 });
  }
}
