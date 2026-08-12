import React from 'react';
import Link from 'next/link';

export default function WishlistPage() {
  return (
    <div className="min-h-screen pt-48 px-6 md:px-12 max-w-7xl mx-auto flex flex-col items-center">
      <h1 className="text-3xl md:text-5xl font-light mb-8 text-black tracking-wide">YOUR WISHLIST</h1>
      <p className="text-gray-500 mb-12 text-center max-w-lg">
        Keep track of all your favorite Elara Silver pieces here. Currently, your wishlist is empty.
      </p>
      
      <Link 
        href="/jewellery" 
        className="px-8 py-4 bg-[#067964] text-white text-sm font-bold tracking-widest uppercase hover:opacity-90 transition-colors"
      >
        CONTINUE SHOPPING
      </Link>
    </div>
  );
}
