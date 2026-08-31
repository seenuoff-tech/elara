'use client';

import React from 'react';
import { motion } from 'framer-motion';

const badgeItems = [
  {
    title: "925 Pure Sterling",
    desc: "Contains 92.5% pure silver alloyed with tarnish-resistant platinum barriers.",
    icon: (
      <svg className="w-12 h-12 text-silver-chrome group-hover:text-black transition-colors duration-300" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="50" cy="50" r="42" strokeDasharray="4 4" />
        <polygon points="50,18 63,40 86,45 66,61 73,85 50,71 27,85 34,61 14,45 37,40" strokeLinecap="round" strokeLinejoin="round" />
        <text x="50" y="54" fontSize="10" fontFamily="monospace" textAnchor="middle" fill="currentColor" stroke="none" fontWeight="bold">925</text>
      </svg>
    )
  },
  {
    title: "BIS",
    desc: "Assay office certified authenticity marking, laser etched onto every shank.",
    icon: (
      <svg className="w-12 h-12 text-silver-chrome group-hover:text-black transition-colors duration-300" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polygon points="50,12 88,78 12,78" strokeLinejoin="round" />
        <circle cx="50" cy="54" r="14" />
        <polygon points="50,45 53,52 60,54 55,59 56,66 50,62 44,66 45,59 40,54 47,52" fill="currentColor" stroke="none" />
      </svg>
    )
  },
  {
    title: "Lifetime Guarantee",
    desc: "Full warranty protection covering metal integrity and stone setting brilliance.",
    icon: (
      <svg className="w-12 h-12 text-silver-chrome group-hover:text-black transition-colors duration-300" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="50" cy="42" r="24" />
        <path d="M38 60L28 88l22-6 22 6-10-28" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M42 42l5 5 11-11" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
  {
    title: "Premium Craft",
    desc: "Touched by generational jewellers, refined to a flawless mirror shine.",
    icon: (
      <svg className="w-12 h-12 text-silver-chrome group-hover:text-black transition-colors duration-300" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="25" y="25" width="50" height="50" transform="rotate(45 50 50)" />
        <path d="M50 15v70M15 50h70" strokeDasharray="2 2" />
        <circle cx="50" cy="50" r="10" fill="currentColor" stroke="none" />
      </svg>
    )
  }
];

export default function TrustBadges() {
  return (
    <section className="relative bg-[#ffffff] py-28 px-6 md:px-12 border-t border-black/5 overflow-hidden">
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-radial from-white/5 to-transparent blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs md:text-sm font-semibold tracking-[0.4em] text-silver-chrome uppercase block">
            Quality Credentials
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight uppercase">
            Certification & Trust
          </h2>
          <p className="text-black/45 font-light text-xs md:text-sm max-w-md mx-auto leading-relaxed">
            Every piece is forged under strict quality assurance standards and laser stamped for authenticity.
          </p>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {badgeItems.map((badge, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              whileHover={{
                y: -6,
                borderColor: "rgba(255, 255, 255, 0.2)"
              }}
              className="flex flex-col items-center text-center p-8 border border-black/5 bg-neutral-50/40 backdrop-blur-md relative group overflow-hidden shine-sweep"
            >
              {/* Radial backdrop hover glow */}
              <div className="absolute inset-0 bg-radial from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              {/* Icon Container */}
              <div className="relative z-10 mb-6 transition-transform duration-300 group-hover:scale-105">
                {badge.icon}
              </div>

              {/* Text */}
              <div className="relative z-10 space-y-2">
                <h4 className="text-sm font-bold tracking-widest uppercase text-black group-hover:text-silver-chrome transition-colors duration-300">
                  {badge.title}
                </h4>
                <p className="text-xs text-black/45 font-light leading-relaxed">
                  {badge.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
