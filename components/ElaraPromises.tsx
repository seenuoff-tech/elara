import React from 'react';
import { Diamond, Gift, Truck, ShieldCheck } from 'lucide-react';

const promises = [
  {
    icon: <Diamond className="w-8 h-8 text-[#D4AF37] mb-6" strokeWidth={1.5} />,
    title: "925 STERLING SILVER",
    description: "Hallmarked & Certified"
  },
  {
    icon: <Gift className="w-8 h-8 text-[#D4AF37] mb-6" strokeWidth={1.5} />,
    title: "PREMIUM PACKAGING",
    description: "Perfect For Gifting"
  },
  {
    icon: <Truck className="w-8 h-8 text-[#D4AF37] mb-6" strokeWidth={1.5} />,
    title: "FREE SHIPPING",
    description: "Across Tamil Nadu"
  },
  {
    icon: <ShieldCheck className="w-8 h-8 text-[#D4AF37] mb-6" strokeWidth={1.5} />,
    title: "7 DAY RETURNS",
    description: "Hassle-Free Process"
  }
];

export default function ElaraPromises() {
  return (
    <section className="bg-[#0B5E64] text-white py-16 md:py-20 border-y border-white/10">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-5xl font-serif text-center mb-16 text-[#D4AF37] tracking-wide">
          Elara Promise
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {promises.map((promise, index) => (
            <div key={index} className="flex flex-col items-center text-center px-4 relative">
              {/* Divider for desktop */}
              {index !== promises.length - 1 && (
                <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 h-24 w-[1px] bg-[#D4AF37]/20" />
              )}
              
              {promise.icon}
              <h3 className="text-[#D4AF37] text-sm tracking-widest uppercase mb-3 font-medium">
                {promise.title}
              </h3>
              <p className="text-white/80 text-sm font-light">
                {promise.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
