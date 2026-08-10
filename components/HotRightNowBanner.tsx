import React from 'react';
import Link from 'next/link';

export default function HotRightNowBanner() {
  return (
    <section className="relative w-full my-12 z-10">
      <div className="relative w-full overflow-hidden bg-white flex flex-col md:flex-row items-stretch min-h-[350px] md:min-h-[450px]">
        
        {/* Left Side: Content */}
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start justify-center p-8 md:pl-24 text-center md:text-left z-20 order-2 md:order-1 h-full py-16 md:py-0">
          <h2 className="flex flex-col items-center md:items-start">
            <span className="font-serif italic text-6xl md:text-8xl tracking-tight mb-2 text-[#0B5E64]">
              Trending
            </span>
            <span className="font-sans text-2xl md:text-4xl font-semibold tracking-[0.3em] uppercase text-gray-900">
              Now
            </span>
          </h2>
          
          <Link href="/shop?collection=hot" className="mt-8 group">
            <div className="bg-[#0B5E64] border-2 border-[#0B5E64] text-white px-8 py-3 rounded-full shadow-lg font-bold tracking-wide hover:bg-[#08494E] hover:scale-105 transition-all duration-300 flex items-center gap-2">
              Shop Now
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        </div>

        {/* Right Side: Video */}
        <div className="w-full md:w-1/2 relative order-1 md:order-2 overflow-hidden bg-white flex items-center justify-center min-h-[300px]">
          <video 
            src="/images/ELARA.mp4" 
            autoPlay 
            muted 
            loop 
            playsInline 
            className="absolute inset-0 w-full h-full object-contain"
          />
        </div>
        
      </div>
    </section>
  );
}
