'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useWishlist } from '../context/WishlistContext';
import { useProducts } from '../context/ProductsContext';
import { useCart } from '../context/CartContext';
import { usePricing } from './PricingProvider';

interface SimilarProductsProps {
  currentProductId: number | string;
}

export default function SimilarProducts({ currentProductId }: SimilarProductsProps) {
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
        stock: product.stock
      } as any,
      'Standard'
    );
  };

  // Filter out the current product and grab up to 4 similar items
  const similarProducts = products.filter(p => String(p.id) !== String(currentProductId)).slice(0, 4);
  const displayProducts = products.filter(p => String(p.id) !== String(currentProductId)).slice(0, 4);

  return (
    <div id="similar-products" className="max-w-7xl mx-auto px-4 md:px-8 mt-24 border-t border-gray-200 pt-16">
      <h2 className="text-xl text-black mb-8">Recently Viewed</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {displayProducts.map((product, index) => (
          <div key={product.id} className="relative flex flex-col group">
            {/* Badge Ribbon (Custom Badge or Best Seller) */}
            {(product.customBadge || product.isBestSeller || (product.stock !== undefined && product.stock <= 0) || product.status === 'Out of Stock') && (
              <div className="absolute top-4 -left-2 z-20 flex flex-col items-start gap-2">
                {((product.stock !== undefined && product.stock <= 0) || product.status === 'Out of Stock') ? (
                  <>
                    <div 
                      className="bg-red-600 text-white text-[10px] md:text-xs font-semibold py-1 pl-3 pr-5 shadow-sm uppercase tracking-wider" 
                      style={{ clipPath: 'polygon(0 0, 100% 0, 85% 50%, 100% 100%, 0 100%)' }}
                    >
                      Out of Stock
                    </div>
                    <div 
                      className="w-2 h-2 bg-red-800 -mt-2" 
                      style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 0)' }} 
                    />
                  </>
                ) : (
                  <>
                    <div 
                      className="bg-[#0B5E64] text-white text-[10px] md:text-xs font-semibold py-1 pl-3 pr-5 shadow-sm uppercase tracking-wider" 
                      style={{ clipPath: 'polygon(0 0, 100% 0, 85% 50%, 100% 100%, 0 100%)' }}
                    >
                      {product.customBadge || 'Bestseller'}
                    </div>
                    <div 
                      className="w-2 h-2 bg-[#07474B] -mt-2" 
                      style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 0)' }} 
                    />
                  </>
                )}
              </div>
            )}
            
            {/* Image Container */}
            <Link href={`/product/${product.name.toLowerCase().replace(/\s+/g, '-')}`} className="aspect-square w-full relative bg-gray-50 flex items-center justify-center mb-4 rounded-xl border border-gray-100 hover:border-black/10 transition-colors block overflow-hidden">
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
              <button onClick={(e) => handleToggleWishlist(product.id, e)} className="absolute top-3 right-3 z-20 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:scale-110 transition-transform">
                {wishlist.includes(product.id) ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-[#0B5E64]">
                    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-400 hover:text-[#0B5E64] transition-colors">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                  </svg>
                )}
              </button>
            </Link>
            
            {/* Details */}
            <div className="flex flex-col flex-grow px-1 mt-2">
              <div className="flex flex-col gap-1 mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-black">
                    {product.newPrice ? `₹${product.newPrice}` : `₹${String(product.price ? product.price : calculatePrice(product.weightInGrams || 0, product.category)).replace('₹', '')}`}
                  </span>
                  <span className="text-xs text-gray-400 line-through font-light">
                    ₹{(product.mrpPrice || product.oldPrice || Math.round((parseFloat(String(product.newPrice || product.price || calculatePrice(product.weightInGrams || 0, product.category)).replace(/[^\d.]/g, '')) || 0) * 1.1)).toLocaleString('en-IN')}
                  </span>
                </div>

              </div>
              
              <p className="text-xs text-gray-600 truncate mb-1">{product.name}</p>
              
              {((product.mrpPrice || product.oldPrice) > (product.newPrice || product.price)) && (
                <p className="text-[10px] font-bold text-[#0B5E64] mb-3">PRICE DROP!</p>
              )}
              
              {((product.stock !== undefined && product.stock <= 0) || product.status === 'Out of Stock') ? (
                <button 
                  disabled
                  className="w-full mt-auto py-2.5 bg-gray-200 text-gray-500 text-xs font-semibold rounded-md cursor-not-allowed"
                >
                  Out of Stock
                </button>
              ) : (
                <button 
                  onClick={(e) => handleAddToCart(product, e)}
                  className="w-full mt-auto py-2.5 bg-[#0B5E64] text-white text-xs font-semibold rounded-md hover:bg-[#08494E] transition-colors duration-300"
                >
                  Add to Cart
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
