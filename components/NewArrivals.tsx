'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useWishlist } from '../context/WishlistContext';
import { useProducts } from '../context/ProductsContext';
import { useCart } from '../context/CartContext';
import { usePricing } from './PricingProvider';

export default function NewArrivals() {
  const { wishlist, toggleWishlist } = useWishlist();
  const { products } = useProducts();
  const { triggerPackagingAnimation } = useCart();
  const { calculatePrice } = usePricing();

  const handleToggleWishlist = (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    toggleWishlist(id);
  };

  const handleAddToCart = (product: any, e: React.MouseEvent) => {
    e.preventDefault();
    triggerPackagingAnimation(
      {
        id: product.id.toString(),
        name: product.name,
        price: product.newPrice ? `₹${product.newPrice}` : (product.price ? `₹${product.price}` : calculatePrice(product.weightInGrams || 0, product.category)),
        image: product.image,
      } as any,
      'Standard'
    );
  };

  return (
    <section className="pt-2 md:pt-8 pb-6 md:pb-20 px-6 md:px-12 bg-white max-w-7xl mx-auto z-10 relative border-t border-black/5">
      <h2 className="text-2xl md:text-3xl font-medium mb-6 md:mb-8 text-left text-black">New arrivals</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.slice(0, 8).map((product, index) => (
          <div key={product.id} className="relative flex flex-col group">
            {/* Best Seller Ribbon */}
            {product.isBestSeller && (
              <div className="absolute top-4 -left-2 z-20 flex flex-col items-start">
                <div 
                  className="bg-[#0B5E64] text-white text-[10px] md:text-xs font-semibold py-1 pl-3 pr-5 shadow-sm" 
                  style={{ clipPath: 'polygon(0 0, 100% 0, 85% 50%, 100% 100%, 0 100%)' }}
                >
                  Bestseller
                </div>
                <div 
                  className="w-2 h-2 bg-[#07474B]" 
                  style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 0)' }} 
                />
              </div>
            )}
            
            {/* Image Container */}
            <Link href={`/product/${product.name.toLowerCase().replace(/\s+/g, '-')}`} className="aspect-square w-full relative bg-gray-50 flex items-center justify-center mb-4 rounded-xl border border-transparent hover:border-black/5 transition-colors block overflow-hidden">
              <Image 
                src={product.image || '/images/org.png'} 
                alt={product.name || 'Product'} 
                fill 
                className="object-cover hover:scale-105 transition-transform duration-500" 
                sizes="(max-width: 768px) 50vw, 25vw"
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
                onClick={(e) => handleToggleWishlist(product.id, e)}
                className="absolute top-3 right-3 z-20 w-8 h-8 flex items-center justify-center hover:scale-110 transition-transform"
                aria-label="Add to wishlist"
              >
                {wishlist.includes(product.id) ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-red-500">
                    <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400 hover:text-red-500 transition-colors">
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
                    {product.newPrice ? `₹${product.newPrice}` : (? + String(product.price ? product.price : calculatePrice(product.weightInGrams || 0, product.category)).replace('?', ''))}
                  </span>
                  {product.oldPrice && <span className="text-xs text-gray-400 line-through font-light">₹{product.oldPrice}</span>}
                </div>

              </div>
              
              <button 
                onClick={(e) => handleAddToCart(product, e)}
                className="w-full mt-auto py-2.5 bg-[#0B5E64] text-white text-xs font-semibold tracking-wide uppercase rounded-md hover:bg-black transition-colors duration-300 shadow-sm"
              >
                Add to cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
