import React from 'react';
import { Diamond, Gift, Truck, ShieldCheck } from 'lucide-react';

const promises = [
  {
    icon: <img src="/images/diamond.png" alt="Diamond" className="w-7 h-7 md:w-8 md:h-8 mb-3 md:mb-6 object-contain" />,
    title: "925 STERLING SILVER",
    description: "Hallmarked & Certified"
  },
  {
    icon: <Gift className="w-7 h-7 md:w-8 md:h-8 text-[#D4AF37] mb-3 md:mb-6" strokeWidth={1.5} />,
    title: "PREMIUM PACKAGING",
    description: "Perfect For Gifting"
  },
  {
    icon: <Truck className="w-7 h-7 md:w-8 md:h-8 text-[#D4AF37] mb-3 md:mb-6" strokeWidth={1.5} />,
    title: "FREE SHIPPING",
    description: "Across Tamil Nadu"
  },
  {
    icon: <ShieldCheck className="w-7 h-7 md:w-8 md:h-8 text-[#D4AF37] mb-3 md:mb-6" strokeWidth={1.5} />,
    title: "7 DAY RETURNS",
    description: "Hassle-Free Process"
  }
];

export default function ElaraPromises() {
  return (
    <section className="bg-[#0B5E64] text-white py-6 md:py-12 border-y border-white/10">
      <div className="container mx-auto px-2 md:px-4">
        <div className="grid grid-cols-4 gap-1 md:gap-12 lg:gap-8 pb-4">
          {promises.map((promise, index) => (
            <div key={index} className="flex flex-col items-center text-center px-1 md:px-4 relative min-w-0">
              {/* Divider for desktop */}
              {index !== promises.length - 1 && (
                <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 h-24 w-[1px] bg-[#D4AF37]/20" />
              )}
              
              {promise.icon}
              <h3 className="text-[#D4AF37] text-[9px] md:text-sm tracking-widest uppercase mb-1 md:mb-3 font-semibold leading-tight">
                {promise.title}
              </h3>
              <p className="text-white/80 text-[8px] md:text-sm font-light leading-tight block">
                {promise.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
