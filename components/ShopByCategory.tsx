'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCategories } from '@/context/CategoriesContext';

export default function ShopByCategory() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { categories } = useCategories();
  const preferredOrder = ["earring", "toe ring", "ring", "minimalist", "bracelet", "anklet", "men"];
  
  const activeCategories = [...categories]
    .filter(c => c.status === 'Active' && !c.name.toLowerCase().includes('set'))
    .sort((a, b) => {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();
      let indexA = preferredOrder.findIndex(name => aName.includes(name));
      let indexB = preferredOrder.findIndex(name => bName.includes(name));
      if (indexA === -1) indexA = 999;
      if (indexB === -1) indexB = 999;
      return indexA - indexB;
    });
  const [activeIndex, setActiveIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);

  useEffect(() => {
    const updateItemsPerPage = () => {
      setItemsPerPage(window.innerWidth >= 768 ? 6 : 3);
    };
    updateItemsPerPage();
    window.addEventListener('resize', updateItemsPerPage);
    return () => window.removeEventListener('resize', updateItemsPerPage);
  }, []);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollLeft = container.scrollLeft;
      const itemWidth = container.clientWidth / itemsPerPage;
      const newIndex = Math.round(scrollLeft / itemWidth);
      setActiveIndex(newIndex);
    }
  };

  const maxIndex = Math.max(0, activeCategories.length - itemsPerPage);

  const scrollTo = (index: number) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const itemWidth = container.clientWidth / itemsPerPage;
      container.scrollTo({ left: itemWidth * index, behavior: 'smooth' });
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <section className="pt-8 pb-8 px-6 md:px-12 bg-white max-w-7xl mx-auto z-10 relative">
      <div className="flex flex-col items-center text-center mb-4 gap-6">
        <div className="space-y-4">
          <div className="w-24 h-[1px] bg-black/10 mx-auto mt-2" />
        </div>
      </div>

      <div className="relative group max-w-6xl mx-auto">
        
        {/* Left Arrow */}
        <button 
          onClick={scrollLeft}
          className="absolute left-0 top-[40%] -translate-y-1/2 -translate-x-4 md:-translate-x-12 z-10 w-8 h-8 md:w-10 md:h-10 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-full flex items-center justify-center shadow-sm text-gray-600 transition-colors hidden md:flex"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Right Arrow */}
        <button 
          onClick={scrollRight}
          className="absolute right-0 top-[40%] -translate-y-1/2 translate-x-4 md:translate-x-12 z-10 w-8 h-8 md:w-10 md:h-10 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-full flex items-center justify-center shadow-sm text-gray-600 transition-colors hidden md:flex"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Scroll Container */}
        <div 
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="grid grid-cols-4 gap-x-2 gap-y-6 md:flex md:gap-10 md:overflow-x-auto scrollbar-hide md:snap-x md:snap-mandatory pb-4 pt-2 px-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {activeCategories.map((category, index) => (
            <Link 
              key={category.id}
              href={`/shop?category=${encodeURIComponent(category.name.toLowerCase())}`}
              className="flex flex-col items-center gap-2 md:gap-4 md:snap-start shrink-0 group/item w-full md:w-auto"
            >
              {/* Image Container (Squircle) */}
              <div className="w-full aspect-square md:w-[130px] md:h-[130px] rounded-[1.2rem] md:rounded-[2rem] bg-gray-50 overflow-hidden relative shadow-sm group-hover/item:shadow-md transition-all">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover object-center group-hover/item:scale-105 transition-transform duration-500"
                  sizes="130px"
                />
              </div>
              
              {/* Category Name */}
              <span className="text-[10px] sm:text-xs md:text-sm text-gray-800 font-medium tracking-wide text-center leading-tight">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Pagination Stars */}
      <div className="hidden md:flex items-center justify-center gap-3 mt-8">
        {Array.from({ length: maxIndex + 1 }).map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
            className="p-1 transition-all duration-300 focus:outline-none"
          >
            <svg 
              className={`w-4 h-4 transition-colors duration-500 ${activeIndex === index ? 'text-[#0B5E64]' : 'text-gray-300'}`} 
              viewBox="0 0 24 24" 
              fill="currentColor"
            >
              {/* Curved Sparkle / Diamond shape */}
              <path d="M12 0 C12 6.627 6.627 12 0 12 C6.627 12 12 17.373 12 24 C12 17.373 17.373 12 24 12 C17.373 12 12 6.627 12 0 Z" />
            </svg>
          </button>
        ))}
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
      `}} />
    </section>
  );
}
