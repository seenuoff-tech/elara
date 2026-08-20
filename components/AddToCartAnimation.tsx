'use client';

import React, { useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';

export default function AddToCartAnimation() {
  const { activeAnimation, confirmAddToCart } = useCart();
  const hasConfirmed = useRef(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (activeAnimation) {
      hasConfirmed.current = false;
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch((err) => {
          console.error('Autoplay blocked or failed:', err);
          handleManualSkip();
        });
      }
    } else {
      if (videoRef.current) {
        videoRef.current.pause();
      }
    }
  }, [activeAnimation]);

  useEffect(() => {
    if (!activeAnimation) return;

    // Fallback timer in case the video stalls or fails to play
    const fallbackTimer = setTimeout(() => {
      if (!hasConfirmed.current) {
        hasConfirmed.current = true;
        confirmAddToCart();
      }
    }, 4500); // 4.5 seconds max duration

    return () => clearTimeout(fallbackTimer);
  }, [activeAnimation, confirmAddToCart]);

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    if (video.duration && video.duration > 0) {
      // Cut off the last 3.2 seconds to hide the Gemini watermark
      if (video.currentTime >= video.duration - 3.2) {
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

  return (
    <div 
      className={`fixed inset-0 z-[999] bg-white flex items-center justify-center overflow-hidden transition-all duration-500 ${
        activeAnimation 
          ? 'opacity-100 pointer-events-auto' 
          : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Container that crops the video edges to hide any black lines/watermarks */}
      <div className="relative w-full h-full overflow-hidden flex items-center justify-center bg-white">
        <video
          ref={videoRef}
          src="/images/addtocart.mp4"
          playsInline
          muted
          preload="auto"
          className="w-full h-full object-cover scale-[1.12] transition-transform duration-300"
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleManualSkip}
          onError={handleManualSkip}
          onLoadedData={(e) => { e.currentTarget.playbackRate = 2.5; }}
        />
      </div>
      
      {/* Skip Button */}
      {activeAnimation && (
        <button 
          onClick={handleManualSkip}
          className="absolute top-8 right-8 px-4 py-2 border border-black/20 text-black/50 hover:text-black hover:border-black/50 hover:bg-black/5 rounded-full transition-all uppercase tracking-[0.2em] text-[10px] font-semibold z-10"
        >
          Skip
        </button>
      )}
    </div>
  );
}
