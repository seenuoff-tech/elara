'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCategories } from '@/context/CategoriesContext';

export default function ShopByCategory() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { categories, isLoaded } = useCategories();
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

      <div className="relative group max-w-5xl mx-auto">
        <div className="grid grid-cols-5 gap-3 md:gap-8 pb-4 pt-2 px-2 md:px-0">
          {!isLoaded ? (
            // Skeleton loader while fetching
            Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5 md:gap-4 w-full animate-pulse">
                <div className="w-full aspect-square rounded-[0.8rem] md:rounded-[2rem] bg-gray-200"></div>
                <div className="w-16 h-3 md:h-4 bg-gray-200 rounded mt-1"></div>
              </div>
            ))
          ) : (
            activeCategories.map((category, idx) => (
              <Link 
                key={category.id}
                href={`/shop?category=${encodeURIComponent(category.name.toLowerCase())}`}
                className="flex flex-col items-center gap-1.5 md:gap-4 group/item w-full"
              >
                {/* Image Container (Squircle) */}
                <div className="w-full aspect-square rounded-[0.8rem] md:rounded-[2rem] bg-gray-50 overflow-hidden relative shadow-sm group-hover/item:shadow-md transition-all">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    priority={idx < 5} // Priority for the first row
                    className="object-cover object-center group-hover/item:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 20vw, 150px"
                  />
                </div>
                
                {/* Category Name */}
                <span className="text-[10px] md:text-sm text-gray-800 font-medium tracking-wide text-center leading-tight mt-1">
                  {category.name}
                </span>
              </Link>
            ))
          )}
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
      `}} />
    </section>
  );
}
