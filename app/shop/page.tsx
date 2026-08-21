'use client';

import React, { useState, useEffect, Suspense, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useProducts } from '../../context/ProductsContext';
import { usePricing } from '../../components/PricingProvider';
import LuxuryButton from '../../components/luxury/LuxuryButton';

function ShopContent() {
  const searchParams = useSearchParams();
  const urlCategory = searchParams.get('category');
  const urlGender = searchParams.get('gender');
  const urlPrice = searchParams.get('price');

  const [mounted, setMounted] = useState(false);
  
  const { products } = useProducts();
  const { calculatePrice } = usePricing();
  const { triggerPackagingAnimation } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();

  // Filters State
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('featured'); // 'featured', 'price-asc', 'price-desc'

  useEffect(() => {
    setMounted(true);
    if (urlCategory) {
      setSelectedCategories([urlCategory.toLowerCase()]);
    } else {
      setSelectedCategories([]);
    }
  }, [urlCategory]);

  const handleAddToCart = (product: any, e: React.MouseEvent) => {
    e.preventDefault();
    const finalPriceStr = product.newPrice ? `₹${product.newPrice}` : (product.price ? `₹${product.price}` : calculatePrice(product.weightInGrams || 0, product.category));
    triggerPackagingAnimation(
      {
        id: product.id.toString(),
        name: product.name,
        price: finalPriceStr,
        image: product.image
      },
      product.sizes ? product.sizes[0] : 'Standard'
    );
  };

  const handleToggleWishlist = (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    toggleWishlist(id);
  };

  const parsePrice = (priceVal: string | number | undefined, weight: number = 0, category: string = '') => {
    let finalPrice = priceVal;
    if (finalPrice === undefined || finalPrice === null || finalPrice === '') {
      finalPrice = calculatePrice(weight, category);
    }
    return parseFloat(String(finalPrice).replace(/[^\d.]/g, '')) || 0;
  };

  // Derived state: Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Filter by Gender logic
    if (urlGender) {
      if (urlGender === 'women') {
        filtered = filtered.filter(p => {
          if (p.targetAudience) return p.targetAudience === 'Women' || p.targetAudience === 'Unisex';
          return !p.category.toLowerCase().includes('mens') && !p.category.toLowerCase().includes('kids');
        });
      } else if (urlGender === 'men') {
        filtered = filtered.filter(p => {
          if (p.targetAudience) return p.targetAudience === 'Men' || p.targetAudience === 'Unisex';
          return p.category.toLowerCase().includes('mens') || p.category.toLowerCase().includes('men');
        });
      } else if (urlGender === 'kids') {
        filtered = filtered.filter(p => {
          if (p.targetAudience) return p.targetAudience === 'Kids' || p.targetAudience === 'Unisex';
          return p.category.toLowerCase().includes('kids');
        });
      }
    }

    // Filter by Price range from URL
    if (urlPrice) {
      const match = urlPrice.match(/under-(\d+)/);
      if (match) {
        const maxPrice = parseInt(match[1]);
        filtered = filtered.filter(p => parsePrice(p.newPrice || p.price, p.weightInGrams, p.category) < maxPrice);
      }
    }

    // Filter by Categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(p => selectedCategories.some(cat => p.category.toLowerCase().includes(cat.toLowerCase())));
    }

    // Sort
    if (sortBy === 'price-asc') {
      filtered.sort((a, b) => {
        const priceA = parsePrice(a.newPrice || a.price, a.weightInGrams, a.category);
        const priceB = parsePrice(b.newPrice || b.price, b.weightInGrams, b.category);
        return priceA - priceB;
      });
    } else if (sortBy === 'price-desc') {
      filtered.sort((a, b) => {
        const priceA = parsePrice(a.newPrice || a.price, a.weightInGrams, a.category);
        const priceB = parsePrice(b.newPrice || b.price, b.weightInGrams, b.category);
        return priceB - priceA;
      });
    }

    return filtered;
  }, [products, urlGender, selectedCategories, sortBy]);

  const allCategories = ['Rings', 'Necklace', 'Bracelet', 'Earings', 'Anklets', 'Chains', 'Toe rings', 'Mens-Rings', 'Mens-Chains', 'Mens-Bracelet', 'Kids-Earings'];

  const toggleCategory = (cat: string) => {
    const lowerCat = cat.toLowerCase();
    setSelectedCategories(prev => 
      prev.includes(lowerCat) ? prev.filter(c => c !== lowerCat) : [...prev, lowerCat]
    );
  };

  if (!mounted) return null;

  return (
    <div className="bg-[#fafafa] min-h-screen pt-48 pb-20">
      
      {/* Header */}
      <section className="py-12 px-6 md:px-12 text-center bg-white border-b border-gray-200 mt-8">
        <h1 className="text-3xl md:text-5xl font-bold tracking-widest uppercase text-black">
          {urlGender ? `${urlGender}'s Jewellery` : 'Our Collection'}
        </h1>
        <p className="mt-4 text-gray-500 max-w-2xl mx-auto text-sm">
          Discover our finely crafted pieces designed for timeless elegance. Use the filters to find your perfect match.
        </p>
      </section>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 shrink-0 space-y-8">
          <div>
            <h3 className="text-lg font-bold tracking-widest uppercase text-black border-b border-gray-200 pb-2 mb-4">Categories</h3>
            <div className="space-y-3">
              {allCategories.map(cat => {
                const lowerCat = cat.toLowerCase();
                const isSelected = selectedCategories.includes(lowerCat);
                return (
                  <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      className="hidden" 
                      checked={isSelected}
                      onChange={() => toggleCategory(cat)}
                    />
                    <div className={`w-4 h-4 border rounded-sm flex items-center justify-center transition-colors ${isSelected ? 'bg-[#0B5E64] border-[#0B5E64]' : 'border-gray-300 group-hover:border-[#0B5E64]'}`}>
                      {isSelected && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
                    </div>
                    <span className="text-sm text-gray-700 group-hover:text-black">{cat.replace('-', ' ')}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Main Grid */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-8 border-b border-gray-200 pb-4">
            <span className="text-sm text-gray-500">{filteredProducts.length} Products Found</span>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Sort by:</label>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm border-gray-300 rounded-md focus:ring-[#0B5E64] focus:border-[#0B5E64]"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => (
                <div key={product.id} className="relative flex flex-col group">
                  <Link href={`/product/${product.name.toLowerCase().replace(/\s+/g, '-')}`} className="block relative aspect-square bg-gray-100 mb-3 overflow-hidden rounded-md">
                    {/* Badge Ribbon (Custom Badge or Best Seller) */}
                    {(product.customBadge || product.isBestSeller) && (
                      <div className="absolute top-3 -left-1 z-20 flex flex-col items-start">
                        <div 
                          className="bg-[#0B5E64] text-white text-[10px] font-semibold py-0.5 pl-2.5 pr-4 shadow-sm uppercase tracking-wider" 
                          style={{ clipPath: 'polygon(0 0, 100% 0, 85% 50%, 100% 100%, 0 100%)' }}
                        >
                          {product.customBadge || 'Bestseller'}
                        </div>
                        <div 
                          className="w-1.5 h-1.5 bg-[#07474B]" 
                          style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 0)' }} 
                        />
                      </div>
                    )}

                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Rating Badge */}
                    <div className="absolute bottom-2 left-2 z-20 bg-gray-100/90 text-gray-700 text-[10px] font-medium px-2 py-1 rounded flex items-center gap-1 shadow-sm backdrop-blur-sm pointer-events-none">
                      <span>4.8</span>
                      <span className="text-[#f59e0b] text-[10px] leading-none mb-0.5">★</span>
                      <span className="text-gray-400 mx-0.5">|</span>
                      <span>{300 + ((index * 47) % 200)}</span>
                    </div>
                    
                    {/* Wishlist Button */}
                    <button 
                      onClick={(e) => handleToggleWishlist(product.id as number, e)}
                      className="absolute top-3 right-3 z-20 w-8 h-8 flex items-center justify-center hover:scale-110 transition-transform"
                      aria-label="Add to wishlist"
                    >
                      {wishlist.includes(product.id as number) ? (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[#0B5E64]">
                          <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400 hover:text-[#0B5E64] transition-colors">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                        </svg>
                      )}
                    </button>
                  </Link>
                  
                  {/* Details */}
                  <div className="flex flex-col flex-grow px-2 mt-2">
                    <Link href={`/product/${product.name.toLowerCase().replace(/\s+/g, '-')}`} className="hover:underline">
                      <h3 className="text-sm font-medium text-gray-900 line-clamp-1 mb-1" title={product.name}>
                        {product.name}
                      </h3>
                    </Link>
                    
                    <div className="flex flex-col gap-1 mb-5">
                      <div className="flex items-center gap-2">
                        <span className="text-[15px] font-bold text-black">
                          {product.newPrice ? `₹${product.newPrice}` : `₹${String(product.price ? product.price : calculatePrice(product.weightInGrams || 0, product.category)).replace('₹', '')}`}
                        </span>
                        <span className="text-xs text-gray-400 line-through font-light">
                          ₹{(product.oldPrice || Math.round((parseFloat(String(product.newPrice || product.price || calculatePrice(product.weightInGrams || 0, product.category)).replace(/[^\d.]/g, '')) || 0) * 1.1)).toLocaleString('en-IN')}
                        </span>
                      </div>

                    </div>
                    
                    {((product.stock !== undefined && product.stock <= 0) || product.status === 'Out of Stock') ? (
                      <button 
                        disabled
                        className="w-full mt-auto py-2.5 bg-gray-200 text-gray-500 text-xs font-semibold tracking-wide uppercase rounded-md cursor-not-allowed"
                      >
                        Out of Stock
                      </button>
                    ) : (
                      <button 
                        onClick={(e) => handleAddToCart(product, e)}
                        className="w-full mt-auto py-2.5 bg-[#0B5E64] text-white text-xs font-semibold tracking-wide uppercase rounded-md hover:bg-black transition-colors duration-300 shadow-sm"
                      >
                        Add to cart
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
              <h3 className="text-xl text-gray-900 font-medium mb-2">No products found</h3>
              <p className="text-gray-500">Try adjusting your filters to find what you're looking for.</p>
              <button 
                onClick={() => setSelectedCategories([])}
                className="mt-6 px-6 py-2 bg-[#0B5E64] text-white text-sm font-semibold rounded-lg hover:bg-black transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fafafa] pt-48 pb-20 flex justify-center items-center">Loading...</div>}>
      <ShopContent />
    </Suspense>
  );
}
