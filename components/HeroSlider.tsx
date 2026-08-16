'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function HeroSlider() {
  const defaultSlides = [
    { id: 'fallback-1', image: '/images/silver_necklace.png', title: 'Silver Necklace', link: '/shop' },
    { id: 'fallback-2', image: '/images/silver_bracelet.png', title: 'Silver Bracelet', link: '/shop' },
    { id: 'fallback-3', image: '/images/silver_rings.png', title: 'Silver Rings', link: '/shop' },
  ];

  const [slides, setSlides] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const res = await fetch(`/api/slides?t=${Date.now()}`, { cache: 'no-store' });
        const data = await res.json();
        if (data.success && data.slides && data.slides.length > 0) {
          const activeSlides = data.slides.filter((s: any) => s.status === 'Active');
          if (activeSlides.length > 0) {
            setSlides(activeSlides);
            setLoading(false);
            return;
          }
        }
        setSlides(defaultSlides);
      } catch (error) {
        console.error('Error fetching slides:', error);
        setSlides(defaultSlides);
      } finally {
        setLoading(false);
      }
    };
    fetchSlides();
  }, []);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % Math.max(1, slides.length));
  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % Math.max(1, slides.length));

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 3000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const getPosition = (index: number) => {
    if (index === current) return 'center';
    if (index === (current - 1 + slides.length) % slides.length) return 'left';
    if (index === (current + 1) % slides.length) return 'right';
    return 'hidden';
  };

  const variants = {
    center: {
      x: '0%',
      y: '-50%',
      top: '50%',
      scale: 1,
      zIndex: 10,
      opacity: 1,
    },
    left: {
      x: '-20%',
      y: '-50%',
      top: '50%',
      scale: 0.85,
      zIndex: 5,
      opacity: 0.8,
    },
    right: {
      x: '20%',
      y: '-50%',
      top: '50%',
      scale: 0.85,
      zIndex: 5,
      opacity: 0.8,
    },
    hidden: {
      x: '0%',
      y: '-50%',
      top: '50%',
      scale: 0.8,
      zIndex: 0,
      opacity: 0,
    },
  };

  return (
    <div 
      className="relative w-full overflow-hidden flex items-center justify-center mt-24 md:mt-[180px]"
      style={{ height: '530px', backgroundColor: '#ffffff', marginBottom: '40px' }}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#0B5E64] border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      {!loading && slides.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-400 uppercase tracking-widest text-sm">
          No active slides available
        </div>
      )}
      {slides.map((slide, index) => {
        const position = getPosition(index);
        
        return (
          <motion.div
            key={slide.id}
            variants={variants}
            initial="hidden"
            animate={position}
            transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
            className="absolute rounded-[1rem] md:rounded-[2.5rem] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-black/5 bg-white"
            style={{ width: '95%', maxWidth: '1187px', height: '100%', maxHeight: '530px' }}
          >
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            />

          </motion.div>
        );
      })}

      {/* Navigation Arrows */}
      <button 
        onClick={prevSlide}
        className="absolute z-30 w-12 h-12 md:w-16 md:h-16 bg-white/40 backdrop-blur-md text-black rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-white/50 transition-all hover:scale-105 hover:bg-white/60 left-4 md:left-12 top-1/2 -translate-y-1/2 group"
        aria-label="Previous Slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
      </button>

      <button 
        onClick={nextSlide}
        className="absolute z-30 w-12 h-12 md:w-16 md:h-16 bg-white/40 backdrop-blur-md text-black rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-white/50 transition-all hover:scale-105 hover:bg-white/60 right-4 md:right-12 top-1/2 -translate-y-1/2 group"
        aria-label="Next Slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </button>
    </div>
  );
}
