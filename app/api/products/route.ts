export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    
    const where = categoryId ? { categoryId } : {};
    
    const [dbProducts, pricingSettings] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.setting.findUnique({ where: { key: 'pricing_rules' } })
    ]);

    // Parse pricing rules
    const pricingData = pricingSettings?.value as any;
    const silverRates: Record<string, number> = pricingData?.silverRates || {};
    const gstPercentage: number = pricingData?.gstPercentage ?? 3;
    const defaultRate = 85;

    // Map products with dynamically computed price from current silver rates
    const products = dbProducts.map(p => {
      const categoryName = p.category ? p.category.name : 'Uncategorized';
      const rate = silverRates[categoryName] ?? defaultRate;
      const weight = p.weightInGrams ?? 0;
      const computedPrice = weight > 0
        ? Math.round(weight * rate * (1 + gstPercentage / 100))
        : p.price;
      return {
        ...p,
        price: computedPrice,
        category: categoryName,
      };
    });
    
    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch products', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    let { name, categoryId, category, price, stock, status, image, gallery, description, isNew, isBestSeller, weightInGrams, finishes } = body;
    
    if (!categoryId && category) {
      const cat = await prisma.category.findFirst({
        where: { name: { equals: category } }
      });
      if (cat) categoryId = cat.id;
    }

    if (!name || !categoryId) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }
    
    const product = await prisma.product.create({
      data: { 
        name, 
        categoryId, 
        price: price ? parseFloat(price) : 0, 
        stock, 
        status, 
        image, 
        gallery: gallery ? gallery : null,
        description: description ? JSON.stringify(description) : null,
        finishes: finishes ? JSON.stringify(finishes) : null,
        isNew: !!isNew,
        isBestSeller: !!isBestSeller,
        weightInGrams: weightInGrams ? parseFloat(weightInGrams) : 0
      }
    });
    
    // Update category count
    await prisma.category.update({
      where: { id: categoryId },
      data: { productsCount: { increment: 1 } }
    });
    
    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ success: false, error: 'Failed to create product', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, categoryId, price, stock, status, image, gallery, description, isNew, isBestSeller, weightInGrams, finishes } = body;
    
    if (!id) {
      return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });
    }
    
    // Handle category count change if category changed
    const oldProduct = await prisma.product.findUnique({ where: { id } });
    
    const product = await prisma.product.update({
      where: { id },
      data: { 
        name, categoryId, price: price ? parseFloat(price) : 0, stock, status, image, 
        gallery: gallery ? gallery : null,
        description: description ? JSON.stringify(description) : null,
        finishes: finishes ? JSON.stringify(finishes) : null,
        isNew: !!isNew, isBestSeller: !!isBestSeller,
        weightInGrams: weightInGrams ? parseFloat(weightInGrams) : 0 
      }
    });
    
    if (oldProduct && oldProduct.categoryId !== categoryId) {
      await prisma.category.update({
        where: { id: oldProduct.categoryId },
        data: { productsCount: { decrement: 1 } }
      });
      await prisma.category.update({
        where: { id: categoryId },
        data: { productsCount: { increment: 1 } }
      });
    }
    
    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ success: false, error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });
    }
    
    const product = await prisma.product.delete({
      where: { id }
    });
    
    if (product.categoryId) {
      await prisma.category.update({
        where: { id: product.categoryId },
        data: { productsCount: { decrement: 1 } }
      });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete product' }, { status: 500 });
  }
}
