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

    // Map products with dynamically computed price from current silver rates if weight_based
    const products = dbProducts.map(p => {
      const categoryName = p.category ? p.category.name : 'Uncategorized';
      const rate = silverRates[categoryName] ?? defaultRate;
      const weight = p.weightInGrams ?? 0;
      const isManual = (p as any).pricingType === 'manual';
      let computedPrice = p.price;
      let computedMrp = (p as any).mrpPrice || null;

      if (isManual) {
        if (p.price > 0) {
          let basePrice = p.price;
          // Apply dynamic weight-based adjustment for manual products
          if ((p as any).baseSilverRate !== null && (p as any).baseSilverRate !== undefined && weight > 0) {
            const rateDiff = rate - (p as any).baseSilverRate;
            basePrice = p.price + (weight * rateDiff);
            
            // Adjust MRP similarly if it exists
            if (computedMrp) {
               computedMrp = computedMrp + (weight * rateDiff);
            }
          }
          basePrice = Math.max(0, basePrice);
          computedPrice = Math.round(basePrice * (1 + gstPercentage / 100));
        }
      } else {
        computedPrice = (weight > 0 ? Math.round(weight * rate * (1 + gstPercentage / 100)) : p.price);
      }

      
      let parsedSizes = [];
      try {
        if (p.sizes) {
          parsedSizes = typeof p.sizes === 'string' ? JSON.parse(p.sizes) : p.sizes;
        } else if (p.ringSizes) {
          parsedSizes = typeof p.ringSizes === 'string' ? JSON.parse(p.ringSizes) : p.ringSizes;
        }
      } catch (e) {
        parsedSizes = [];
      }

      let parsedDescription = { inspiration: '', design: '' };
      try {
        if (p.description) {
          parsedDescription = typeof p.description === 'string' ? JSON.parse(p.description) : p.description;
        }
      } catch (e) {
        parsedDescription = { inspiration: '', design: '' };
      }

      let parsedFinishes = [];
      try {
        if (p.finishes) {
          parsedFinishes = typeof p.finishes === 'string' ? JSON.parse(p.finishes) : p.finishes;
        }
      } catch (e) {
        parsedFinishes = [];
      }

      return {
        ...p,
        price: computedPrice,
        basePrice: p.price,
        category: categoryName,
        pricingType: (p as any).pricingType || 'weight_based',
        customBadge: (p as any).customBadge || null,
        targetAudience: (p as any).targetAudience || 'Women',
        mrpPrice: computedMrp,
        baseSilverRate: (p as any).baseSilverRate || null,
        sizes: parsedSizes,
        finishes: parsedFinishes,
        description: parsedDescription
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
    let { name, categoryId, category, price, stock, status, image, gallery, description, isNew, isBestSeller, customBadge, weightInGrams, finishes, sizes, ringSizes, pricingType, targetAudience, mrpPrice, baseSilverRate } = body;
    
    if (!categoryId && category) {
      const cat = await prisma.category.findFirst({
        where: { name: { equals: category } }
      });
      if (cat) categoryId = cat.id;
    }

    if (!name || !categoryId) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }
    
    const parsedStock = parseInt(stock) || 0;
    const finalStatus = parsedStock === 0 ? 'Out of Stock' : (status || 'Active');

    const product = await prisma.product.create({
      data: { 
        name, 
        categoryId, 
        price: price ? parseFloat(price) : 0, 
        stock: parsedStock, 
        status: finalStatus, 
        image, 
        gallery: gallery ? gallery : null,
        description: description ? JSON.stringify(description) : null,
        finishes: finishes ? JSON.stringify(finishes) : null,
        sizes: sizes ? JSON.stringify(sizes) : (ringSizes ? JSON.stringify(ringSizes) : null),
        ringSizes: ringSizes ? JSON.stringify(ringSizes) : null,
        isNew: !!isNew,
        isBestSeller: !!isBestSeller,
        customBadge: customBadge ? String(customBadge).trim() : null,
        weightInGrams: weightInGrams ? parseFloat(weightInGrams) : 0,
        pricingType: pricingType || 'weight_based',
        targetAudience: targetAudience || 'Women',
        mrpPrice: mrpPrice ? parseFloat(mrpPrice) : null,
        baseSilverRate: baseSilverRate ? parseFloat(baseSilverRate) : null
      } as any
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
    const { id, name, categoryId, price, stock, status, image, gallery, description, isNew, isBestSeller, customBadge, weightInGrams, finishes, sizes, ringSizes, pricingType, targetAudience, mrpPrice, baseSilverRate } = body;
    
    if (!id) {
      return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });
    }
    
    // Handle category count change if category changed
    const oldProduct = await prisma.product.findUnique({ where: { id } });
    
    const parsedStock = stock !== undefined ? parseInt(stock) : (oldProduct?.stock ?? 0);
    const finalStatus = parsedStock === 0 ? 'Out of Stock' : (status || oldProduct?.status || 'Active');

    let finalCategoryId = categoryId;
    if (body.category) {
      const cat = await prisma.category.findFirst({
        where: { name: { equals: body.category } }
      });
      if (cat) finalCategoryId = cat.id;
    }

    const product = await prisma.product.update({
      where: { id },
      data: { 
        name, categoryId: finalCategoryId, price: price ? parseFloat(price) : 0, 
        stock: parsedStock, 
        status: finalStatus, 
        image, 
        gallery: gallery ? gallery : null,
        description: description ? JSON.stringify(description) : null,
        finishes: finishes ? JSON.stringify(finishes) : null,
        sizes: sizes ? JSON.stringify(sizes) : (ringSizes ? JSON.stringify(ringSizes) : null),
        ringSizes: ringSizes ? JSON.stringify(ringSizes) : null,
        isNew: !!isNew, isBestSeller: !!isBestSeller,
        customBadge: customBadge ? String(customBadge).trim() : null,
        weightInGrams: weightInGrams ? parseFloat(weightInGrams) : 0,
        pricingType: pricingType || 'weight_based',
        targetAudience: targetAudience || 'Women',
        mrpPrice: mrpPrice !== undefined ? (mrpPrice ? parseFloat(mrpPrice) : null) : undefined,
        baseSilverRate: baseSilverRate !== undefined ? (baseSilverRate ? parseFloat(baseSilverRate) : null) : undefined
      } as any
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
