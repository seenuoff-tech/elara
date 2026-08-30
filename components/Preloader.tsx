'use client';

import React, { useState, useEffect } from 'react';

export default function Preloader() {
  const [loading, setLoading] = useState(true);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    // Wait a bit, then start fading out
    const fadeTimer = setTimeout(() => {
      setFade(true);
    }, 1500); // Show full opacity for 1.5s

    // Remove from DOM completely after fade out animation
    const removeTimer = setTimeout(() => {
      setLoading(false);
    }, 2000); // 1.5s + 0.5s fade duration

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!loading) return null;

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/70 backdrop-blur-md transition-opacity duration-500 ease-in-out ${
        fade ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
      }`}
    >
      <div className="flex flex-col items-center animate-pulse">
        <img 
          src="/images/org.png" 
          alt="Elara Silver Logo" 
          className="h-16 md:h-24 object-contain brightness-0" 
        />
        <div className="mt-8 flex gap-2">
          <div className="w-2 h-2 rounded-full bg-[#0B5E64] animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 rounded-full bg-[#0B5E64] animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 rounded-full bg-[#0B5E64] animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}
