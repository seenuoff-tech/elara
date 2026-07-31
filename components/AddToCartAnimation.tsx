'use client';

import React, { useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';

export default function AddToCartAnimation() {
  const { activeAnimation, confirmAddToCart } = useCart();
  const hasConfirmed = useRef(false);

  useEffect(() => {
    if (!activeAnimation) {
      hasConfirmed.current = false;
      return;
    }
    
    // Fallback timer in case the video stalls or fails to play
    const fallbackTimer = setTimeout(() => {
      if (!hasConfirmed.current) {
        hasConfirmed.current = true;
        confirmAddToCart();
      }
    }, 10000); // 10 seconds max duration

    return () => clearTimeout(fallbackTimer);
  }, [activeAnimation, confirmAddToCart]);

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    if (video.duration && video.duration > 0) {
      // Cut off the last 1.5 seconds to hide the Gemini watermark
      if (video.currentTime >= video.duration - 1.5) {
        if (!hasConfirmed.current) {
          hasConfirmed.current = true;
          confirmAddToCart();
        }
      }
    }
  };

  const handleManualSkip = () => {
    if (!hasConfirmed.current) {
      hasConfirmed.current = true;
      confirmAddToCart();
    }
  };

  if (!activeAnimation) return null;

  return (
    <div className="fixed inset-0 z-[999] bg-white flex items-center justify-center overflow-hidden animate-in fade-in duration-500">
      <video
        src="/images/addtocart.mp4"
        autoPlay
        playsInline
        muted
        className="w-full h-full max-w-5xl max-h-[85vh] object-contain"
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleManualSkip}
        onError={handleManualSkip}
      />
      
      {/* Skip Button for convenience */}
      <button 
        onClick={handleManualSkip}
        className="absolute top-8 right-8 px-4 py-2 border border-black/20 text-black/50 hover:text-black hover:border-black/50 hover:bg-black/5 rounded-full transition-all uppercase tracking-[0.2em] text-[10px] font-semibold"
      >
        Skip
      </button>
    </div>
  );
}
