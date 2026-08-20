'use client';

import React from 'react';

const testimonials = [
  {
    name: "Karthi Chidambaram",
    date: "June 15, 2025",
    text: "I recently bought a beautiful silver ring from Elara Silver Shop for my anniversary. The craftsmanship is absolutely stunning and it fits perfectly. Their customer service made the whole experience memorable.",
  },
  {
    name: "Nithya Ramasamy",
    date: "August 22, 2025",
    text: "The silver necklace I purchased at Elara Silver Shop is now my everyday essential. It's elegant, lightweight, and adds the perfect touch to any outfit. I constantly get compliments on it!",
  },
  {
    name: "Arjun Prabhakar",
    date: "November 05, 2025",
    text: "I was looking for a sturdy yet stylish silver chain, and Elara Silver Shop had exactly what I needed. The quality of the silver is top-notch, and it feels incredibly premium.",
  },
  {
    name: "Meenakshi Sundaram",
    date: "January 18, 2026",
    text: "I gifted a pair of silver earrings from Elara Silver Shop to my sister. She was thrilled with the intricate design and the radiant finish. Truly the best place for authentic silver jewelry.",
  },
  {
    name: "Dinesh Karthikeyan",
    date: "April 10, 2026",
    text: "My new silver bracelet from Elara Silver Shop is absolutely gorgeous! It reflects modern style while maintaining a classic charm. I am very impressed with their unique collection.",
  },
  {
    name: "Sathiyapriya Thirumalai",
    date: "June 02, 2026",
    text: "I bought a delicate silver anklet at Elara Silver Shop and I couldn't be happier. The detail on the piece is flawless, and it's so comfortable for daily wear. Highly recommended!",
  },
];

export default function Testimonials() {
  return (
    <section className="pt-4 md:pt-8 pb-12 md:pb-24 bg-[#FAFAFA] overflow-hidden relative z-10 border-t border-black/5">
      {/* Rose background at the bottom */}
      <div className="absolute bottom-0 left-0 w-full h-[300px] bg-gradient-to-t from-rose-100/80 to-transparent z-0 pointer-events-none" />
      
      <div className="text-center mb-16 relative z-10">
        <h2 className="text-4xl md:text-5xl font-medium text-[#0B5E64]">Love Letters</h2>
      </div>

      {/* Infinite Marquee Container */}
      <div className="relative w-full flex items-center">
        {/* Edge Gradients for smooth fade out */}
        <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-[#FAFAFA] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-[#FAFAFA] to-transparent z-10 pointer-events-none" />
        
        {/* Marquee Track */}
        <div className="flex w-max animate-[marquee_40s_linear_infinite] hover:animate-[marquee_40s_linear_infinite_paused] space-x-6 py-8 px-6">
          {/* We duplicate the array to create a seamless loop */}
          {[...testimonials, ...testimonials, ...testimonials].map((testimonial, idx) => {
            // Alternating rotations based on index to create the wavy/tilted look
            const rotateClass = idx % 3 === 0 ? '-rotate-3' : idx % 3 === 1 ? 'rotate-2' : '-rotate-1';
            const translateY = idx % 2 === 0 ? 'translate-y-4' : '-translate-y-2';

            return (
              <div 
                key={idx} 
                className={`w-[320px] flex-shrink-0 bg-white rounded-3xl p-8 shadow-[0_15px_30px_-15px_rgba(0,0,0,0.1)] border border-gray-100 flex flex-col ${rotateClass} ${translateY} transition-transform hover:scale-105 hover:z-20 duration-300`}
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm mb-1">{testimonial.name}</h3>
                    <p className="text-[10px] text-gray-400">{testimonial.date}</p>
                  </div>
                  <span className="text-4xl text-[#0B5E64] leading-none font-serif font-black mt-[-10px]">“</span>
                </div>
                <p className="text-[13px] text-gray-600 leading-relaxed font-medium">
                  {testimonial.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* We add Tailwind arbitrary variants via style if they aren't configured in tailwind.config */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-33.33% - 12px)); } /* Shift by exactly 1/3 of the items since we triplicated */
        }
      `}} />
    </section>
  );
}
