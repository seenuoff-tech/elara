import React from 'react';
import Link from 'next/link';

const LuxuryWithinReach = () => {
  return (
    <section className="w-full max-w-5xl mx-auto mt-8 md:mt-14 mb-6 md:mb-16 px-4">
      <h2 className="text-center text-2xl md:text-4xl font-semibold text-[#0B5E64] tracking-wide mb-8">
        Affordable Elegance
      </h2>

      <div className="flex md:justify-center overflow-x-auto snap-x snap-mandatory gap-4 pb-4 w-full hide-scrollbar">
        <Link href="/shop?price=under-999" className="group min-w-[130px] md:min-w-[160px] snap-center">
          <div className="bg-[#0B5E64] border border-black/5 text-white rounded-[1.25rem] p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center h-full relative overflow-hidden">
            <span className="text-sm md:text-base font-medium opacity-90 mb-1 z-10">Under</span>
            <span className="text-2xl md:text-3xl font-bold tracking-wider z-10">₹999</span>
          </div>
        </Link>
        
        <Link href="/shop?price=under-1999" className="group min-w-[130px] md:min-w-[160px] snap-center">
          <div className="bg-[#0B5E64] border border-black/5 text-white rounded-[1.25rem] p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center h-full relative overflow-hidden">
            <span className="text-sm md:text-base font-medium opacity-90 mb-1 z-10">Under</span>
            <span className="text-2xl md:text-3xl font-bold tracking-wider z-10">₹1999</span>
          </div>
        </Link>

        <Link href="/shop?price=under-2999" className="group min-w-[130px] md:min-w-[160px] snap-center">
          <div className="bg-[#0B5E64] border border-black/5 text-white rounded-[1.25rem] p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center h-full relative overflow-hidden">
            <span className="text-sm md:text-base font-medium opacity-90 mb-1 z-10">Under</span>
            <span className="text-2xl md:text-3xl font-bold tracking-wider z-10">₹2999</span>
          </div>
        </Link>

        <Link href="/shop?price=under-4999" className="group min-w-[130px] md:min-w-[160px] snap-center">
          <div className="bg-[#0B5E64] border border-black/5 text-white rounded-[1.25rem] p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center h-full relative overflow-hidden">
            <span className="text-sm md:text-base font-medium opacity-90 mb-1 z-10">Under</span>
            <span className="text-2xl md:text-3xl font-bold tracking-wider z-10">₹4999</span>
          </div>
        </Link>
      </div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default LuxuryWithinReach;
