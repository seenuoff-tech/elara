import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    
    const where = categoryId ? { categoryId } : {};
    
    const dbProducts = await prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: 'desc' }
    });
    
    // Map to include category string for frontend backward compatibility
    const products = dbProducts.map(p => ({
      ...p,
      category: p.category ? p.category.name : 'Uncategorized'
    }));
    
    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    let { name, categoryId, category, price, stock, status, image, description, isNew, isBestSeller } = body;
    
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
        price: price || (body.weightInGrams ? body.weightInGrams * 250 : 0), 
        stock, 
        status, 
        image, 
        description: description ? JSON.stringify(description) : null, 
        isNew: !!isNew,
        isBestSeller: !!isBestSeller
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
    return NextResponse.json({ success: false, error: 'Failed to create product' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, categoryId, price, stock, status, image, description, isNew, isBestSeller } = body;
    
    if (!id) {
      return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });
    }
    
    // Handle category count change if category changed
    const oldProduct = await prisma.product.findUnique({ where: { id } });
    
    const product = await prisma.product.update({
      where: { id },
      data: { name, categoryId, price, stock, status, image, description, isNew: !!isNew, isBestSeller: !!isBestSeller }
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
