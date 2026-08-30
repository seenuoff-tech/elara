import React from 'react';
import Link from 'next/link';

export default function JewelleryCare() {
  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-6 md:px-12">
        <h1 className="text-3xl md:text-4xl font-light tracking-wide uppercase text-black mb-8 text-center">Jewellery Care</h1>
        
        <div className="space-y-6 text-gray-700 leading-relaxed font-light text-sm md:text-base">
          <p>
            Silver jewels have a soft luster, and so they can get tarnished easily if not taken care of. Follow these simple steps to care your jewellery just like how you care for yourself :)
          </p>
          
          <ul className="list-disc list-inside space-y-3 pl-2 md:pl-4">
            <li>Do not wear when sweating.</li>
            <li>Avoid perfume, lotion or sunscreen after wearing the jewel.</li>
            <li>Do not wear when washing.</li>
            <li>Avoid collide, grind or fire.</li>
            <li>Do not wear when sleeping.</li>
            <li>Put inside a plastic box when not in use. Avoid velvet box.</li>
            <li>Do not clean with chemicals.</li>
            <li>Use soft cloth to clean.</li>
          </ul>

          <div className="pt-8 flex justify-center">
            <Link href="/shop" className="inline-block py-3 px-8 text-sm font-bold tracking-widest uppercase bg-[#0B5E64] text-white hover:bg-[#08494E] transition-colors duration-300">
              Back to Shop
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
