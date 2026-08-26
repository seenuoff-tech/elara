import React from 'react';
import Link from 'next/link';

export default function JewelleryCare() {
  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-6 md:px-12">
        <h1 className="text-3xl md:text-5xl font-light tracking-wide uppercase text-black mb-8 text-center">Jewellery Care Guide</h1>
        
        <div className="space-y-12 text-gray-700 leading-relaxed font-light">
          <section className="bg-gray-50 p-8 rounded-xl border border-gray-100">
            <h2 className="text-xl font-medium text-black mb-4 uppercase tracking-widest">General Care</h2>
            <p className="mb-4">
              Solid sterling silver is a precious metal that requires a little love and care to maintain its shine. With proper care, your Elara Silver jewelry will last a lifetime.
            </p>
            <ul className="list-disc list-inside space-y-3 pl-2">
              <li>Store your silver jewellery in a cool, dry place, preferably in an airtight zip lock bag or a tarnish-resistant pouch.</li>
              <li>Avoid exposing your jewelry to extreme temperatures or direct sunlight for prolonged periods.</li>
              <li>Remove your jewelry before swimming, showering, or engaging in strenuous physical activities.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-medium text-black mb-4 uppercase tracking-widest border-b border-gray-200 pb-2">What to Avoid</h2>
            <ul className="list-disc list-inside space-y-3 pl-2">
              <li><strong>Chemicals:</strong> Avoid direct contact with perfumes, lotions, hairspray, and harsh cleaning chemicals. Apply these products before putting on your jewelry.</li>
              <li><strong>Water:</strong> While pure water doesn't harm sterling silver, the chemicals in swimming pools, hot tubs, and salt water can cause tarnishing or damage.</li>
              <li><strong>Sweat:</strong> The amino acids in sweat can cause silver to tarnish faster.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-medium text-black mb-4 uppercase tracking-widest border-b border-gray-200 pb-2">Cleaning Your Silver</h2>
            <p className="mb-4">
              Regular cleaning helps maintain the natural shine of your sterling silver jewelry and prevents tarnish buildup.
            </p>
            <ul className="list-disc list-inside space-y-3 pl-2">
              <li><strong>Polishing Cloth:</strong> Clean gently with a soft polishing cloth to maintain its shine. Use long back-and-forth motions rather than rubbing in circles.</li>
              <li><strong>Soap and Water:</strong> For mild cleaning, use warm water and a small amount of mild dish soap. Use a soft-bristle toothbrush to gently clean intricate areas.</li>
              <li><strong>Drying:</strong> Always ensure your jewelry is completely dry before storing it away.</li>
            </ul>
          </section>

          <div className="pt-8 flex justify-center">
            <Link href="/shop" className="inline-block py-4 px-12 text-sm font-bold tracking-widest uppercase bg-[#0B5E64] text-white hover:bg-black transition-colors duration-500">
              Back to Shop
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
