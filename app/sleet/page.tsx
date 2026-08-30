'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function SleetComingSoon() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 overflow-hidden">
      
      {/* Animated Icon / Sparkle */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mb-6"
      >
        <svg className="w-16 h-16 text-[#0B5E64]/30 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m9-9H3m15.364-6.364l-12.728 12.728m12.728 0L5.636 5.636" />
        </svg>
      </motion.div>

      {/* Title Animation */}
      <motion.h1 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        className="font-serif text-5xl md:text-7xl text-[#0B5E64] mb-6 drop-shadow-sm"
      >
        Sleet Jewellery
      </motion.h1>

      {/* Subtext Animation with letter spacing pulse */}
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
        className="text-gray-500 text-xl md:text-3xl font-light tracking-[0.2em] uppercase"
      >
        <motion.span
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          is coming soon
        </motion.span>
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear", delay: 0 }}
        >
          .
        </motion.span>
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear", delay: 0.3 }}
        >
          .
        </motion.span>
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear", delay: 0.6 }}
        >
          .
        </motion.span>
      </motion.p>
      
      {/* Background abstract decoration */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.03 }}
        transition={{ duration: 2, delay: 1 }}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] md:w-[40vw] md:h-[40vw] rounded-full bg-[#0B5E64] blur-[100px] -z-10 pointer-events-none"
      />
    </div>
  );
}
